import { books, type books_v1 } from '@googleapis/books';
import { log } from '~/lib/log4js';

const api = books('v1');

async function getVolume(reqid: string, volume_id: string) {
  log.trace(reqid, 'getVolume');

  const { data: volume } = await api.volumes.get({ volumeId: volume_id });

  return transformVolume(volume);
}

async function listVolume(
  reqid: string,
  query: {
    q: string;
    queryfield?:
      | ''
      | 'intitle' // Returns results where the text following this keyword is found in the title.
      | 'inauthor' // Returns results where the text following this keyword is found in the author.
      | 'inpublisher' // Returns results where the text following this keyword is found in the publisher.
      | 'subject' // Returns results where the text following this keyword is listed in the category list of the volume.
      | 'isbn' // Returns results where the text following this keyword is the ISBN number.
      | 'lccn' // Returns results where the text following this keyword is the Library of Congress Control Number.
      | 'oclc'; // Returns results where the text following this keyword is the Online Computer Library Center number.
    offset?: number; // Index of the first result to return (starts at 0)
    limit?: number; // Maximum number of results to return. Acceptable values are 0 to 40, inclusive.
    orderBy?:
      | 'newest' /* Most recently published. */
      | 'relevance' /* Relevance to search terms. */;
    printType?:
      | 'all' /* All volume content types. */
      | 'books' /* Just books. */
      | 'magazines' /* Just magazines. */;
    projection?:
      | 'full' /* Includes all volume data. */
      | 'lite' /* Includes a subset of fields in volumeInfo and accessInfo. */;
  },
) {
  log.trace(reqid, 'listVolume');

  const { data } = await api.volumes.list({
    q: query.queryfield ? `${query.queryfield}:${query.q}` : query.q,
    startIndex: query.offset,
    maxResults: query.limit,
    orderBy: query.orderBy,
    printType: query.printType,
    projection: query.projection,
  });

  data.items?.map(transformVolume);

  return {
    items: data.items?.map(transformVolume),
    kind: data.kind,
    totalItems: data.totalItems,
  };
}

export const BookRepository = {
  getVolume,
  listVolume,
};

function transformVolume(volume: books_v1.Schema$Volume) {
  // HTMLタグが含まれる場合があるので除去する
  if (volume?.volumeInfo?.description) {
    volume.volumeInfo.description = volume.volumeInfo.description.replace(/(<([^>]+)>)/gi, '');
  }

  return volume;
}

// Volume (GoogleAPI) の情報とマージする
// Conditional Types がうまく使えなかったため、 オーバーロード関数 (overload function) を使った。
// 引数が Post | null のときは Nullable 、 引数が Post のときは NonNullable にしたかった。
export async function mergeVolume<T extends { volume_id: string }>(
  reqid: string,
  t: T,
): Promise<T & { volume: books_v1.Schema$Volume | undefined }>;
export async function mergeVolume<T extends { volume_id: string }>(
  reqid: string,
  t: T | null,
): Promise<(T & { volume: books_v1.Schema$Volume | undefined }) | null>;
export async function mergeVolume<T extends { volume_id: string }>(reqid: string, t: T | null) {
  if (t === null) {
    return null;
  }

  const volume = t.volume_id
    ? await BookRepository.getVolume(reqid, t.volume_id).catch(() => undefined)
    : undefined;

  return {
    ...t,
    volume,
  };
}

import { books } from '@googleapis/books';
import { log } from '~/lib/log4js';

const api = books('v1');

async function getVolume(reqid: string, volume_id: string) {
  log.trace(reqid, 'getVolume');

  const { data: volume } = await api.volumes.get({ volumeId: volume_id });

  return volume;
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
    startIndex?: number; // Index of the first result to return (starts at 0)
    maxResults?: number; // Maximum number of results to return. Acceptable values are 0 to 40, inclusive.
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
    startIndex: query.startIndex,
    maxResults: query.maxResults,
    orderBy: query.orderBy,
    printType: query.printType,
    projection: query.projection,
  });

  return data;
}

export const BookRepository = {
  getVolume,
  listVolume,
};

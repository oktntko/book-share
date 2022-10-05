import axios from "~/libs/axios";

export type Book = {
  // 追加
  book_id: string;
  book_title: string;

  // kind: "books#volume"; // Resource type for a volume. (In LITE projection.)
  id: string; // Unique identifier for a volume. (In LITE projection.)
  // etag: string; // Opaque identifier for a specific version of a volume resource. (In LITE projection)
  // Volume API のGET (ex) https://www.googleapis.com/books/v1/volumes/ke9XEAAAQBAJ
  selfLink: string; // URL to this resource. (In LITE projection.)
  volumeInfo: {
    // General volume information.
    title: string; // Volume title. (In LITE projection.)
    subtitle: string; // Volume subtitle. (In LITE projection.)
    authors: string[]; // The names of the authors and/or editors for this volume. (In LITE projection)
    publisher: string; // Publisher of this volume. (In LITE projection.)
    publishedDate: string; // Date of publication. (In LITE projection.)
    description: string; // A synopsis of the volume. The text of the description is formatted in HTML and includes simple formatting elements, such as b, i, and br tags. (in LITE projection)
    contentVersion: string; // An identifier for the version of the volume content (text & images). (In LITE projection)
    infoLink: string; // URL to view information about this volume on the Google Books site. (In LITE projection)
    // canonicalVolumeLink: string; // Canonical URL for a volume. (In LITE projection.)
    previewLink: string; // URL to preview this volume on the Google Books site.
    imageLinks?: {
      // A list of image links for all the sizes that are available. (in LITE projection)
      thumbnail: string; // Image link for thumbnail size (width of ~128 pixels). (in LITE projection)
      smallThumbnail: string; // Image link for small thumbnail size (width of ~80 pixels). (in LITE projection)
      small?: string; // Image link for small size (width of ~300 pixels). (in LITE projection)
      medium?: string; // Image link for medium size (width of ~575 pixels). (in LITE projection)
      large?: string; // Image link for large size (width of ~800 pixels). (in LITE projection)
      extraLarge?: string; // Image link for extra large size (width of ~1280 pixels). (in LITE projection)
    };
    saleInfo: {
      // Any information about a volume related to the eBookstore and/or purchaseability. This information can depend on the country where the request originates from (i.e. books may not be for sale in certain countries).
      // buyLink: string; // URL to purchase this volume on the Google Books site. (in LITE projection)
      country: string; // The two-letter ISO_3166-1 country code for which this sale information is valid. (In LITE projection.)
      listPrice: {
        // Suggested retail price. (in LITE projection)
        amount: number; // Amount in the currency listed below. (In LITE projection.)
        currencyCode: string; // An ISO 4217, three-letter currency code. (In LITE projection.)
      };
      retailPrice: {
        // The actual selling price of the book. This is the same as the suggested retail or list price unless there are offers or discounts on this volume. (in LITE projection)
        amount: number; // Amount in the currency listed below. (In LITE projection.)
        currencyCode: string; // An ISO 4217, three-letter currency code. (In LITE projection.)
      };
    };
    accessInfo: {
      // Any information about a volume related to reading or obtaining that volume text. This information can depend on country (books may be public domain in one country but not in another, e.g.).
      accessViewStatus: string; // Combines the access and viewability of this volume into a single status field for this user. Values can be FULL_PURCHASED, FULL_PUBLIC_DOMAIN, SAMPLE or NONE. (In LITE projection.)
      country: string; // The two-letter ISO_3166-1 country code for which this access information is valid. (In LITE projection.)
      epub: {
        // Information about epub content. (in LITE projection)
        downloadLink: string; // URL to download epub. (In LITE projection.)
        acsTokenLink: string; // URL to retrieve ACS token for epub download. (In LITE projection.)
        isAvailable: boolean; // Is a flowing text epub available either as public domain or for purchase. (In LITE projection.)
      };
      pdf: {
        // Information about pdf content. (in LITE projection)
        downloadLink: string; // URL to download pdf. (In LITE projection.)
        acsTokenLink: string; // URL to retrieve ACS token for pdf download. (In LITE projection.)
        isAvailable: boolean; // Is a scanned image pdf available either as public domain or for purchase. (In LITE projection.)
      };
    };
    searchInfo: {
      // Search result information related to this volume.
      textSnippet: string; // A text snippet containing the search query.
    };
  };
};

export type BookQuery = {
  q: string;
  queryfield?:
    | ""
    | "intitle" // Returns results where the text following this keyword is found in the title.
    | "inauthor" // Returns results where the text following this keyword is found in the author.
    | "inpublisher" // Returns results where the text following this keyword is found in the publisher.
    | "subject" // Returns results where the text following this keyword is listed in the category list of the volume.
    | "isbn" // Returns results where the text following this keyword is the ISBN number.
    | "lccn" // Returns results where the text following this keyword is the Library of Congress Control Number.
    | "oclc"; // Returns results where the text following this keyword is the Online Computer Library Center number.
  startIndex?: number; // Index of the first result to return (starts at 0)
  maxResults?: number; // Maximum number of results to return. Acceptable values are 0 to 40, inclusive.
  orderBy?: "newest" /* Most recently published. */ | "relevance" /* Relevance to search terms. */;
  printType?:
    | "all" /* All volume content types. */
    | "books" /* Just books. */
    | "magazines" /* Just magazines. */;
  projection?:
    | "full" /* Includes all volume data. */
    | "lite" /* Includes a subset of fields in volumeInfo and accessInfo. */;
};

async function getBook(book_id: string) {
  const { data: book } = await axios.get<Book>(
    `https://www.googleapis.com/books/v1/volumes/${book_id}`
  );

  return transformBook(book);
}

async function listBook(query: BookQuery) {
  const { data } = await axios.get<{
    kind: string;
    totalItems: number;
    items: Book[];
  }>(`https://www.googleapis.com/books/v1/volumes/`, {
    params: {
      q: query.queryfield ? `${query.queryfield}:${query.q}` : query.q,
      startIndex: query.startIndex,
      maxResults: query.maxResults,
      orderBy: query.orderBy,
      printType: query.printType,
      projection: query.projection,
    },
  });

  return {
    total: data.totalItems,
    books: data.items?.map(transformBook),
  };
}

export const BooksRepository = {
  getBook,
  listBook,
};

function transformBook(book: Book) {
  book.book_id = book.id;
  book.book_title = book.volumeInfo.title;
  // HTMLタグが含まれる場合があるので除去する
  book.volumeInfo.description = book.volumeInfo.description?.replace(/(<([^>]+)>)/gi, "");

  return book;
}

/**
 * 1. node_modules/@googleapis/books/build/v1.d.ts を開く
 * 2. 次のスキーマをコピーする
 *  - Schema$DownloadAccessRestriction
 *  - Schema$ReadingPosition
 *  - Schema$Review
 *  - Schema$Volumeseriesinfo
 *  - Schema$Volume
 * 3. https://transform.tools/typescript-to-zod に張り付ける
 * 4. VolumeseriesinfoSchema.volumeSeries に nullable がつかないので手動でつける
 */
//

import { z } from 'zod';

export const DownloadAccessRestrictionSchema = z.object({
  deviceAllowed: z.boolean().optional().nullable(),
  downloadsAcquired: z.number().optional().nullable(),
  justAcquired: z.boolean().optional().nullable(),
  kind: z.string().optional().nullable(),
  maxDownloadDevices: z.number().optional().nullable(),
  message: z.string().optional().nullable(),
  nonce: z.string().optional().nullable(),
  reasonCode: z.string().optional().nullable(),
  restricted: z.boolean().optional().nullable(),
  signature: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  volumeId: z.string().optional().nullable(),
});

export const ReadingPositionSchema = z.object({
  epubCfiPosition: z.string().optional().nullable(),
  gbImagePosition: z.string().optional().nullable(),
  gbTextPosition: z.string().optional().nullable(),
  kind: z.string().optional().nullable(),
  pdfPosition: z.string().optional().nullable(),
  updated: z.string().optional().nullable(),
  volumeId: z.string().optional().nullable(),
});

export const ReviewSchema = z.object({
  author: z
    .object({
      displayName: z.string().optional(),
    })
    .optional()
    .nullable(),
  content: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  fullTextUrl: z.string().optional().nullable(),
  kind: z.string().optional().nullable(),
  rating: z.string().optional().nullable(),
  source: z
    .object({
      description: z.string().optional(),
      extraDescription: z.string().optional(),
      url: z.string().optional(),
    })
    .optional()
    .nullable(),
  title: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  volumeId: z.string().optional().nullable(),
});

export const VolumeseriesinfoSchema = z.object({
  bookDisplayNumber: z.string().optional().nullable(),
  kind: z.string().optional().nullable(),
  shortSeriesBookTitle: z.string().optional().nullable(),
  volumeSeries: z
    .array(
      z.object({
        issue: z
          .array(
            z.object({
              issueDisplayNumber: z.string().optional(),
              issueOrderNumber: z.number().optional(),
            }),
          )
          .optional(),
        orderNumber: z.number().optional(),
        seriesBookType: z.string().optional(),
        seriesId: z.string().optional(),
      }),
    )
    .optional()
    .nullable(),
});

export const VolumeSchema = z.object({
  accessInfo: z
    .object({
      accessViewStatus: z.string().optional(),
      country: z.string().optional(),
      downloadAccess: DownloadAccessRestrictionSchema.optional(),
      driveImportedContentLink: z.string().optional(),
      embeddable: z.boolean().optional(),
      epub: z
        .object({
          acsTokenLink: z.string().optional(),
          downloadLink: z.string().optional(),
          isAvailable: z.boolean().optional(),
        })
        .optional(),
      explicitOfflineLicenseManagement: z.boolean().optional(),
      pdf: z
        .object({
          acsTokenLink: z.string().optional(),
          downloadLink: z.string().optional(),
          isAvailable: z.boolean().optional(),
        })
        .optional(),
      publicDomain: z.boolean().optional(),
      quoteSharingAllowed: z.boolean().optional(),
      textToSpeechPermission: z.string().optional(),
      viewOrderUrl: z.string().optional(),
      viewability: z.string().optional(),
      webReaderLink: z.string().optional(),
    })
    .optional()
    .nullable(),
  etag: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  kind: z.string().optional().nullable(),
  layerInfo: z
    .object({
      layers: z
        .array(
          z.object({
            layerId: z.string().optional(),
            volumeAnnotationsVersion: z.string().optional(),
          }),
        )
        .optional(),
    })
    .optional()
    .nullable(),
  recommendedInfo: z
    .object({
      explanation: z.string().optional(),
    })
    .optional()
    .nullable(),
  saleInfo: z
    .object({
      buyLink: z.string().optional(),
      country: z.string().optional(),
      isEbook: z.boolean().optional(),
      listPrice: z
        .object({
          amount: z.number().optional(),
          currencyCode: z.string().optional(),
        })
        .optional(),
      offers: z
        .array(
          z.object({
            finskyOfferType: z.number().optional(),
            giftable: z.boolean().optional(),
            listPrice: z
              .object({
                amountInMicros: z.number().optional(),
                currencyCode: z.string().optional(),
              })
              .optional(),
            rentalDuration: z
              .object({
                count: z.number().optional(),
                unit: z.string().optional(),
              })
              .optional(),
            retailPrice: z
              .object({
                amountInMicros: z.number().optional(),
                currencyCode: z.string().optional(),
              })
              .optional(),
          }),
        )
        .optional(),
      onSaleDate: z.string().optional(),
      retailPrice: z
        .object({
          amount: z.number().optional(),
          currencyCode: z.string().optional(),
        })
        .optional(),
      saleability: z.string().optional(),
    })
    .optional()
    .nullable(),
  searchInfo: z
    .object({
      textSnippet: z.string().optional(),
    })
    .optional()
    .nullable(),
  selfLink: z.string().optional().nullable(),
  userInfo: z
    .object({
      acquiredTime: z.string().optional(),
      acquisitionType: z.number().optional(),
      copy: z
        .object({
          allowedCharacterCount: z.number().optional(),
          limitType: z.string().optional(),
          remainingCharacterCount: z.number().optional(),
          updated: z.string().optional(),
        })
        .optional(),
      entitlementType: z.number().optional(),
      familySharing: z
        .object({
          familyRole: z.string().optional(),
          isSharingAllowed: z.boolean().optional(),
          isSharingDisabledByFop: z.boolean().optional(),
        })
        .optional(),
      isFamilySharedFromUser: z.boolean().optional(),
      isFamilySharedToUser: z.boolean().optional(),
      isFamilySharingAllowed: z.boolean().optional(),
      isFamilySharingDisabledByFop: z.boolean().optional(),
      isInMyBooks: z.boolean().optional(),
      isPreordered: z.boolean().optional(),
      isPurchased: z.boolean().optional(),
      isUploaded: z.boolean().optional(),
      readingPosition: ReadingPositionSchema.optional(),
      rentalPeriod: z
        .object({
          endUtcSec: z.string().optional(),
          startUtcSec: z.string().optional(),
        })
        .optional(),
      rentalState: z.string().optional(),
      review: ReviewSchema.optional(),
      updated: z.string().optional(),
      userUploadedVolumeInfo: z
        .object({
          processingState: z.string().optional(),
        })
        .optional(),
    })
    .optional()
    .nullable(),
  volumeInfo: z
    .object({
      allowAnonLogging: z.boolean().optional(),
      authors: z.array(z.string()).optional(),
      averageRating: z.number().optional(),
      canonicalVolumeLink: z.string().optional(),
      categories: z.array(z.string()).optional(),
      comicsContent: z.boolean().optional(),
      contentVersion: z.string().optional(),
      description: z.string().optional(),
      dimensions: z
        .object({
          height: z.string().optional(),
          thickness: z.string().optional(),
          width: z.string().optional(),
        })
        .optional(),
      imageLinks: z
        .object({
          extraLarge: z.string().optional(),
          large: z.string().optional(),
          medium: z.string().optional(),
          small: z.string().optional(),
          smallThumbnail: z.string().optional(),
          thumbnail: z.string().optional(),
        })
        .optional(),
      industryIdentifiers: z
        .array(
          z.object({
            identifier: z.string().optional(),
            type: z.string().optional(),
          }),
        )
        .optional(),
      infoLink: z.string().optional(),
      language: z.string().optional(),
      mainCategory: z.string().optional(),
      maturityRating: z.string().optional(),
      pageCount: z.number().optional(),
      panelizationSummary: z
        .object({
          containsEpubBubbles: z.boolean().optional(),
          containsImageBubbles: z.boolean().optional(),
          epubBubbleVersion: z.string().optional(),
          imageBubbleVersion: z.string().optional(),
        })
        .optional(),
      previewLink: z.string().optional(),
      printType: z.string().optional(),
      printedPageCount: z.number().optional(),
      publishedDate: z.string().optional(),
      publisher: z.string().optional(),
      ratingsCount: z.number().optional(),
      readingModes: z
        .object({
          image: z.boolean().optional(),
          text: z.boolean().optional(),
        })
        .optional(),
      samplePageCount: z.number().optional(),
      seriesInfo: VolumeseriesinfoSchema.optional(),
      subtitle: z.string().optional(),
      title: z.string().optional(),
    })
    .optional()
    .nullable(),
});

const listInput = z.object({
  q: z.string(),
  queryfield: z
    .union([
      z.literal(''),
      z.literal('intitle'),
      z.literal('inauthor'),
      z.literal('inpublisher'),
      z.literal('subject'),
      z.literal('isbn'),
      z.literal('lccn'),
      z.literal('oclc'),
    ])
    .optional(),
  startIndex: z.number().optional(),
  maxResults: z.number().optional(),
  orderBy: z.union([z.literal('newest'), z.literal('relevance')]).optional(),
  printType: z.union([z.literal('all'), z.literal('books'), z.literal('magazines')]).optional(),
  projection: z.union([z.literal('full'), z.literal('lite')]).optional(),
});

const listOutput = z.object({
  total: z.number(),
  volume_list: z.array(VolumeSchema),
});

const getInput = z.object({
  volume_id: z.string().trim().min(1).max(100),
});

export const BookRouterSchema = {
  listInput,
  listOutput,
  getInput,
};

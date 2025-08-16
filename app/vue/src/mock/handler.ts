/* eslint-disable @cspell/spellchecker */
import type { TrpcRouter } from '@book-share/express';
import { OutputProfileSchema, PostSchemaOutput } from '@book-share/express/schema';
import { R } from '@book-share/lib/remeda';
import { z } from '@book-share/lib/zod';
import type { ReadingrecordSchema } from '@book-share/prisma/schema';
import { faker } from '@faker-js/faker';
import type { RequestHandler, WebSocketHandler } from 'msw';
import { createTRPCMsw, httpLink } from 'msw-trpc';
import type { Op } from 'quill';
import superjson from 'superjson';

const trpcMsw = createTRPCMsw<typeof TrpcRouter>({
  links: [
    httpLink({
      url: `${import.meta.env.BASE_URL}api/trpc`,
    }),
  ],
  transformer: {
    input: superjson,
    output: superjson,
  },
});

export const handlers: Array<RequestHandler | WebSocketHandler> = [
  // auth
  trpcMsw.auth.signup.mutation(() => {
    // void
  }),
  trpcMsw.auth.signin.mutation(() => {
    return {
      auth: true,
    };
  }),
  trpcMsw.auth.signinTwofa.mutation(() => {
    return {
      auth: true,
    };
  }),
  trpcMsw.auth.get.query(() => {
    return profile();
  }),
  trpcMsw.auth.delete.mutation(() => {
    // void
  }),

  // book
  trpcMsw.book.listVolume.query(() => {
    return {
      total: 100,
      volume_list,
    };
  }),
  trpcMsw.book.getVolume.query(() => {
    const i = faker.number.int({
      min: 0,
      max: volume_list.length - 1,
    });
    return volume_list[i]!;
  }),
  trpcMsw.book.ranking.query(() => {
    return {
      volume_list: volume_list.map((x, i) => ({ count: i + 1, ...x })),
    };
  }),

  // file
  // TODO

  // post
  trpcMsw.post.list.query(() => {
    return {
      total: 100,
      post_list: R.range(1, faker.number.int({ max: 20 })).map(post),
    };
  }),
  trpcMsw.post.getMyPostList.query(() => {
    return {
      total: 100,
      post_list: R.range(1, faker.number.int({ max: 20 })).map(post),
    };
  }),
  trpcMsw.post.get.query(() => {
    return post();
  }),
  trpcMsw.post.getMyPost.query(() => {
    return post();
  }),
  trpcMsw.post.create.mutation(() => {
    return post();
  }),
  trpcMsw.post.update.mutation(() => {
    return post();
  }),
  trpcMsw.post.delete.mutation(() => {
    return post();
  }),
  trpcMsw.post.publish.mutation(() => {
    return post();
  }),

  // profile
  trpcMsw.profile.get.query(() => {
    return profile();
  }),
  trpcMsw.profile.patchProfile.mutation(() => {
    return profile();
  }),
  trpcMsw.profile.patchPassword.mutation(() => {
    return profile();
  }),
  trpcMsw.profile.delete.mutation(() => {
    // void
  }),
  trpcMsw.profile.generateSecret.mutation(() => {
    return {
      dataurl:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMQAAADECAYAAADApo5rAAAAAklEQVR4AewaftIAAAjqSURBVO3BQW4ESZIgQdUA//9lncIcfO3kQCCTrO4dE7F/sNb6Xw9rreNhrXU8rLWOh7XW8bDWOh7WWsfDWut4WGsdD2ut42GtdTystY6HtdbxsNY6HtZax8Na6/jhQyp/qWJSeaPiDZWp4hMqU8Wk8omKG5Wp4hMqU8Wk8pcqPvGw1joe1lrHw1rr+OHLKr5J5aZiUpkqJpWp4qbiDZU3VN6omFQmlU+oTBXfVPFNKt/0sNY6HtZax8Na6/jhl6m8UfGGyidU3qiYVKaKSWWqeENlUrmpmFTeqJhUpoqp4hMqb1T8poe11vGw1joe1lrHD//lKm5UbiomlaliUvmEyk3FGxWfUFn/z8Na63hYax0Pa63jh/WRiknlmypuVG4qPqHyf8nDWut4WGsdD2ut44dfVvGbVG4qJpVPVNxUTCo3FTcqb1S8ofIJlanijYr/JA9rreNhrXU8rLWOH75M5d9UMalMFZPKVDGpTBWTylRxUzGpTBU3FZPKjcpUcVMxqXyTyn+yh7XW8bDWOh7WWscPH6r4N1VMKm9UvKHyRsWk8k0VNxWTylTxhsobFf9NHtZax8Na63hYax0/fEhlqphUpoo3VG4qbiomlTcqJpWp4kZlqnijYlK5qZhUvqliUnlDZaq4UZkqJpWp4hMPa63jYa11PKy1jh/+ZSo3FZPKpDJVTCpTxaQyVfwmlaniRuUTFZPKpHJTMalMFTcqU8Wk8p/kYa11PKy1joe11vHDfziVqeKNik+oTBWTyk3FpPJNFTcqv0nlExWfqPimh7XW8bDWOh7WWscPX6YyVUwqU8UbKjcVNypTxScqJpWbiknlpuITFTcqU8WkclNxo/KGylRxozJVfOJhrXU8rLWOh7XW8cOHKm5Upoo3VP6SylQxqUwVU8Wk8gmVNypuVKaKNyomlaliqphUpoqp4kblNz2stY6HtdbxsNY6fvhjKm9U3KjcqNyoTBVvqEwVU8U3qUwVb1RMKlPFN6n8N3lYax0Pa63jYa11/PAhlaliqphUpooblaliqphUpopJ5Q2Vm4pJ5TdVTCo3FZ+o+E0qU8Wk8pce1lrHw1rreFhrHfYPvkhlqphUbipuVG4q/pLKVDGp3FTcqEwVn1B5o2JSmSomlaliUnmj4i89rLWOh7XW8bDWOuwffJHKTcWNyk3FpPKJiknljYrfpHJTMancVPwllaniRmWq+EsPa63jYa11PKy1jh8+pDJV3KhMFVPFX1L5hMpUMancVNxUTCo3FZPKN6lMFZPKjcpU8QmVqeITD2ut42GtdTystY4ffpnKGyo3FVPFjcpUcaNyU3Gj8gmVN1SmiqniDZWp4kZlqphUpopJ5UZlqvhND2ut42GtdTystY4f/ljFpHJT8YbKN1W8UTGpTBVvVEwqU8UbKlPFVHFTcaMyVdxU3KjcVHzTw1rreFhrHQ9rreOHX1YxqUwVk8qkclNxUzGp3FRMKlPFjcpvqphUbipuVKaKG5U3VKaKSeUNlanimx7WWsfDWut4WGsdP3yo4psqflPFN6lMFZPKpHJTcaMyVUwqn1D5RMWkMqncVEwqU8WkMlV84mGtdTystY6Htdbxw4dUpopJZap4Q+Wm4kZlqrhReaNiUrmpmFQmlU9UvFHxhspUcVMxqdyo/Jse1lrHw1rreFhrHT98mcpUMam8UXGjMlVMKr9JZar4RMUbKlPFpDJVTCpTxaTylyreqPimh7XW8bDWOh7WWscPH6q4UZkqblQmlTdU3lCZKiaVm4r/ZBWTylRxUzGpfKJiUplUpoq/9LDWOh7WWsfDWuv44ZdVTCo3FTcqNxWTyhsqU8WNyk3FpDJVTCpTxaTyTSq/SeWmYlJ5Q2Wq+MTDWut4WGsdD2ut44cPqUwVk8pUMancqLyhcqNyUzGpTBU3FZPKX1KZKm4q3lCZVKaKN1RuVKaK3/Sw1joe1lrHw1rr+OFDFTcVk8obFTcqNxVvqEwVk8pU8UbFpDJVTCpTxRsqNypTxaQyVXxTxaQyVUwqv+lhrXU8rLWOh7XW8cOXqUwVU8WkcqMyVXyTyjepTBWTyo3KVHGjMlVMFZ+ouFGZKqaKSeWm4t/0sNY6HtZax8Na6/jhyyomlU9UTCpTxaTyRsWk8obKjcpUMam8oXKjclMxqUwVk8onVN5Q+Tc9rLWOh7XW8bDWOn74kMobFZPKpPKGylTxhspUMancVNyofELljYpJ5RMVNyqfUJkqJpWp4jc9rLWOh7XW8bDWOn74UMWNyqQyVUwqU8WNyqQyVXyiYlK5UZkq3qh4Q2VSmSreUPmmijdUpopJZar4poe11vGw1joe1lqH/YMPqNxUTCpTxaRyU/EJlaliUpkqblSmihuVqWJSmSomlZuKSeWmYlKZKiaV31Rxo3JT8YmHtdbxsNY6HtZaxw8fqnij4qbiDZWbijcqblRuVG4qJpWpYlK5qZhUpopJ5Q2VqWJSmSreUPlP8rDWOh7WWsfDWuv44UMqf6nipmJSmSreUJkqJpWp4kblExU3FZPKjcpUMal8QmWq+ETFpPJND2ut42GtdTystY4fvqzim1RuKiaVqeJGZaq4UZkqJpWp4qZiUpkqPlExqdyoTBWTyhsVb6i8UfFND2ut42GtdTystY4ffpnKGxWfqJhUPlExqXyTylRxozJV/CaVN1R+U8WkMlV84mGtdTystY6Htdbxw/9nVKaKSWWq+KaKT6hMFX+p4g2Vm4oblaliUvlLD2ut42GtdTystY4f/supvFExqUwV36QyVdyovKFyU3FTMalMFZPKVDGpfELlRuU3Pay1joe11vGw1jrsH3xAZar4JpWp4kZlqphUPlExqdxU/CaVqWJSuan4hMobFTcqU8VfelhrHQ9rreNhrXXYP/iAyl+qmFTeqJhUpopJ5Y2KSeWNihuVqeINlZuKN1RuKiaVT1RMKlPFJx7WWsfDWut4WGsd9g/WWv/rYa11PKy1joe11vGw1joe1lrHw1rreFhrHQ9rreNhrXU8rLWOh7XW8bDWOh7WWsfDWut4WGsd/wPjqqEFS2ms9QAAAABJRU5ErkJggg==',
    };
  }),
  trpcMsw.profile.enableSecret.mutation(() => {
    // void
  }),
  trpcMsw.profile.disableSecret.mutation(() => {
    // void
  }),

  // readingrecord
  trpcMsw.readingrecord.list.query(() => {
    return {
      total: 100,
      readingrecord_list: R.range(1, faker.number.int({ max: 20 })).map(readingrecord),
    };
  }),
  trpcMsw.readingrecord.get.query(() => {
    return readingrecord();
  }),
  trpcMsw.readingrecord.create.mutation(() => {
    return readingrecord();
  }),
  trpcMsw.readingrecord.update.mutation(() => {
    return readingrecord();
  }),
  trpcMsw.readingrecord.delete.mutation(() => {
    return readingrecord();
  }),
];

const volume_list = [
  {
    accessInfo: {
      accessViewStatus: 'SAMPLE',
      country: 'JP',
      epub: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E6%98%A5%E5%A4%8F_%E7%BE%8E%E3%81%97%E3%81%84%E5%A4%A7%E4%BA%BA%E3%81%AE%E7%B7%A8%E3%81%BF%E3%82%82%E3%81%AE-sample-epub.acsm?id=XWYeEAAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
      pdf: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E6%98%A5%E5%A4%8F_%E7%BE%8E%E3%81%97%E3%81%84%E5%A4%A7%E4%BA%BA%E3%81%AE%E7%B7%A8%E3%81%BF%E3%82%82%E3%81%AE-sample-pdf.acsm?id=XWYeEAAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
    },
    etag: 'eK/oeMalFxU',
    id: 'XWYeEAAAQBAJ',
    kind: 'books#volume',
    saleInfo: {
      buyLink:
        'https://play.google.com/store/books/details?id=XWYeEAAAQBAJ&rdid=book-XWYeEAAAQBAJ&rdot=1&source=gbs_api',
      country: 'JP',
      listPrice: {
        amount: 1320,
        currencyCode: 'JPY',
      },
      offers: [
        {
          finskyOfferType: 1,
          listPrice: {
            amountInMicros: 1320000000,
            currencyCode: 'JPY',
          },
          retailPrice: {
            amountInMicros: 1188000000,
            currencyCode: 'JPY',
          },
        },
      ],
      retailPrice: {
        amount: 1188,
        currencyCode: 'JPY',
      },
    },
    searchInfo: {
      textSnippet:
        'ブティック社編集部. <b>あああ</b>上<b>ああああああ</b>上<b>あああ</b>上ああああ上<b>あああ</b>上<b>あああ</b>上<b>あああ</b>上<b>ああああああ</b>土ああ土今今今本<b>あああ</b> ※ 1 段めは、鎖目の裏山. <b>あああああ</b>ああああ土<b>あああ</b>土<b>あああ</b> H <b>あああああ</b>今ああああああああ土<b>ああああああ</b>!<b>あああ</b>玉<b>あああ</b>玉&nbsp;...',
    },
    selfLink: 'https://books.googleapis.com/books/v1/volumes/XWYeEAAAQBAJ',
    volumeInfo: {
      allowAnonLogging: false,
      authors: ['ブティック社編集部'],
      canonicalVolumeLink: 'https://play.google.com/store/books/details?id=XWYeEAAAQBAJ',
      contentVersion: '0.2.0.0.preview.3',
      description:
        '※この商品はタブレットなど大きいディスプレイを備えた端末で読むことに適しています。また、文字だけを拡大することや、文字列のハイライト、検索、辞書の参照、引用などの機能が使用できません。 大人に似合う春夏の手編みのウエアと小物27点。こだわりの糸で編んだお洒落なデザインが魅力。ウエアはプルオーバーを中心にベストや羽織もの、小物は注目のエコバッグや巾着タイプ、帽子、ストールなどを掲載。',
      imageLinks: {
        smallThumbnail:
          'http://books.google.com/books/content?id=XWYeEAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
        thumbnail:
          'http://books.google.com/books/content?id=XWYeEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      },
      infoLink: 'https://play.google.com/store/books/details?id=XWYeEAAAQBAJ&source=gbs_api',
      maturityRating: 'MATURE',
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      previewLink:
        'http://books.google.co.jp/books?id=XWYeEAAAQBAJ&pg=PA40&dq=%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82&hl=&as_pt=ALLTYPES&cd=1&source=gbs_api',
      publishedDate: '2021-01-26',
      publisher: 'ブティック社',
      readingModes: {
        image: true,
        text: true,
      },
      title: '春夏　美しい大人の編みもの',
    },
  },
  {
    accessInfo: {
      accessViewStatus: 'SAMPLE',
      country: 'JP',
      epub: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E3%83%80%E3%83%B3%E3%82%B8%E3%83%A7%E3%83%B3%E3%82%B7%E3%83%BC%E3%82%AB%E3%83%BC%E3%82%BA_%E3%82%B9%E3%83%9E%E3%83%9B-sample-epub.acsm?id=PHbiEAAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
      pdf: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E3%83%80%E3%83%B3%E3%82%B8%E3%83%A7%E3%83%B3%E3%82%B7%E3%83%BC%E3%82%AB%E3%83%BC%E3%82%BA_%E3%82%B9%E3%83%9E%E3%83%9B-sample-pdf.acsm?id=PHbiEAAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
    },
    etag: 'GVjzL1gfzvM',
    id: 'PHbiEAAAQBAJ',
    kind: 'books#volume',
    saleInfo: {
      buyLink:
        'https://play.google.com/store/books/details?id=PHbiEAAAQBAJ&rdid=book-PHbiEAAAQBAJ&rdot=1&source=gbs_api',
      country: 'JP',
      listPrice: {
        amount: 123,
        currencyCode: 'JPY',
      },
      offers: [
        {
          finskyOfferType: 1,
          listPrice: {
            amountInMicros: 123000000,
            currencyCode: 'JPY',
          },
          retailPrice: {
            amountInMicros: 123000000,
            currencyCode: 'JPY',
          },
        },
      ],
      retailPrice: {
        amount: 123,
        currencyCode: 'JPY',
      },
    },
    searchInfo: {
      textSnippet:
        '... ああああ鳴呼ああアア<b>ああああああ</b>ああああアアァアアァアあ鳴呼<b>あああああ</b>鳴呼アアああぁ<b>あああ</b>ああああがあがああああああああアアッッ!!!!あぁああああああああああああああああああああああああああっっ!!!!』』 ふざけた人間風情が。一匹残らず.',
    },
    selfLink: 'https://books.googleapis.com/books/v1/volumes/PHbiEAAAQBAJ',
    volumeInfo: {
      allowAnonLogging: true,
      authors: ['七篠康晴', '冬野ユウキ'],
      canonicalVolumeLink: 'https://play.google.com/store/books/details?id=PHbiEAAAQBAJ',
      contentVersion: '0.3.3.0.preview.3',
      description:
        'A級ダンジョンを攻略した結果、その身を竜へと変じた広龍《ヒロ》。 そして、『才幹の妖異殺し』となった里葉。 その他の勢力にとって無視できない強大な存在となったふたり。『ダンジョンシーカーズ』の正式リリースとともに一変した世界で、物語は妖異殺しの旧家、雨宮の因縁との決着へと動き出す――。 現代ダンジョンファンタジー第2巻！',
      imageLinks: {
        smallThumbnail:
          'http://books.google.com/books/content?id=PHbiEAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
        thumbnail:
          'http://books.google.com/books/content?id=PHbiEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      },
      infoLink: 'https://play.google.com/store/books/details?id=PHbiEAAAQBAJ&source=gbs_api',
      maturityRating: 'NOT_MATURE',
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      previewLink:
        'http://books.google.co.jp/books?id=PHbiEAAAQBAJ&pg=PT93&dq=%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82&hl=&as_pt=ALLTYPES&cd=2&source=gbs_api',
      publishedDate: '2023-11-15',
      publisher: '一二三書房',
      readingModes: {
        image: true,
        text: true,
      },
      seriesInfo: {
        bookDisplayNumber: '2',
        kind: 'books#volume_series_info',
        volumeSeries: [
          {
            orderNumber: 2,
            seriesBookType: 'COLLECTED_EDITION',
            seriesId: '3DHCGwAAABAfKM',
          },
        ],
      },
      title:
        'ダンジョンシーカーズ～スマホアプリからはじまる現代ダンジョン制圧録～（サーガフォレスト）２',
    },
  },
  {
    accessInfo: {
      accessViewStatus: 'SAMPLE',
      country: 'JP',
      epub: {
        isAvailable: false,
      },
      pdf: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/Oracle%E3%81%AF%E3%81%93%E3%81%86%E5%8B%95%E3%81%84%E3%81%A6%E3%81%84%E3%82%8B-sample-pdf.acsm?id=e1_WEOQPO1cC&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
    },
    etag: 'bOvmk9zUPbI',
    id: 'e1_WEOQPO1cC',
    kind: 'books#volume',
    saleInfo: {
      country: 'JP',
    },
    searchInfo: {
      textSnippet:
        '... <b>あああああ</b> COLUMN2 ROWID 0000000001 ROWID1 ううううう 0000000002 ROWID2 <b>あああああ</b> 0000000003 ROWID3 いいいいい 0000000004 ROWID4 <b>あああああ</b> 0000000005 ROWID5 いいいいい 0000000006 ROWID6 ううううう 0000000007 ROWID7 <b>あああああ</b>&nbsp;...',
    },
    selfLink: 'https://books.googleapis.com/books/v1/volumes/e1_WEOQPO1cC',
    volumeInfo: {
      allowAnonLogging: false,
      authors: ['榎本茂男'],
      canonicalVolumeLink:
        'https://books.google.com/books/about/Oracle%E3%81%AF%E3%81%93%E3%81%86%E5%8B%95%E3%81%84%E3%81%A6%E3%81%84%E3%82%8B.html?hl=&id=e1_WEOQPO1cC',
      contentVersion: '0.6.6.0.preview.1',
      description:
        'Oracleのディープな世界へようこそ。DBA必読!内部動作が分かれば、問題解決能力が格段にUPします。',
      imageLinks: {
        smallThumbnail:
          'http://books.google.com/books/content?id=e1_WEOQPO1cC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
        thumbnail:
          'http://books.google.com/books/content?id=e1_WEOQPO1cC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      },
      infoLink:
        'http://books.google.co.jp/books?id=e1_WEOQPO1cC&dq=%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82&hl=&as_pt=ALLTYPES&source=gbs_api',
      maturityRating: 'NOT_MATURE',
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      previewLink:
        'http://books.google.co.jp/books?id=e1_WEOQPO1cC&pg=PA132&dq=%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82&hl=&as_pt=ALLTYPES&cd=3&source=gbs_api',
      publishedDate: '2005-11',
      publisher: 'Alphapolis Co., Ltd.',
      readingModes: {
        image: true,
        text: false,
      },
      subtitle: 'Oracle徹底検証',
      title: 'Oracleはこう動いている。',
    },
  },
  {
    accessInfo: {
      accessViewStatus: 'SAMPLE',
      country: 'JP',
      epub: {
        isAvailable: false,
      },
      pdf: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E3%81%8B%E3%82%93%E3%81%9F%E3%82%93%E3%82%A2%E3%83%A1%E3%83%96%E3%83%AD%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3_Ame-sample-pdf.acsm?id=BKwn_RiGFMcC&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
    },
    etag: '8r3hJ0JDA5k',
    id: 'BKwn_RiGFMcC',
    kind: 'books#volume',
    saleInfo: {
      buyLink:
        'https://play.google.com/store/books/details?id=BKwn_RiGFMcC&rdid=book-BKwn_RiGFMcC&rdot=1&source=gbs_api',
      country: 'JP',
      listPrice: {
        amount: 1848,
        currencyCode: 'JPY',
      },
      offers: [
        {
          finskyOfferType: 1,
          listPrice: {
            amountInMicros: 1848000000,
            currencyCode: 'JPY',
          },
          retailPrice: {
            amountInMicros: 1663000000,
            currencyCode: 'JPY',
          },
        },
      ],
      retailPrice: {
        amount: 1663,
        currencyCode: 'JPY',
      },
    },
    searchInfo: {
      textSnippet:
        '... <b>あああああ</b> Profile ホームページ 6.ショップ Interior New Basts Season A thems Nakamura 古い物です~先日仕入れてきました。はいです~ Cabar 123 4 30 789 10 11 12 13 14 15 16 17 ます。 34 25227 6b CSS fs fp すネイルプロ赤ワインああああああああ&nbsp;...',
    },
    selfLink: 'https://books.googleapis.com/books/v1/volumes/BKwn_RiGFMcC',
    volumeInfo: {
      allowAnonLogging: true,
      authors: ['中村義和'],
      canonicalVolumeLink: 'https://play.google.com/store/books/details?id=BKwn_RiGFMcC',
      contentVersion: '1.496.3.0.preview.1',
      description:
        'アメブロのデザインを自分好みに変えてみよう 携帯からも気軽にアップでき、更新なども手軽できるアメーバブログ(通称アメブロ)。そうした大人気のアメブロですが、最近ではカスタマイズの自由度が増してきています。一方、アメブロユーザーの方も「既存のテンプレートでなく、自分好みのデザインにしたい」という人が増えてきています。本書は、そうしたユーザーに向けてアメブロの独自タグとスタイルシートを使ってブログデザインのカスタマイズ手法を解説する書籍です。各章では「自分好みにデザインを変えたい」というアメブロユーザーのニーズに応え、メニューやレイアウトなど、さまざまなカスタマイズ欲求に応える構成にしています。「ブログのデザインを変えたい」アメブロユーザーの方が「これは使える!」と納得する、そんな1冊です。 ※本電子書籍は同名出版物を底本とし作成しました。記載内容は印刷出版当時のものです。 ※印刷出版再現のため電子書籍としては不要な情報を含んでいる場合があります。 ※印刷出版とは異なる表記・表現の場合があります。予めご了承ください。 (翔泳社)',
      imageLinks: {
        smallThumbnail:
          'http://books.google.com/books/content?id=BKwn_RiGFMcC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
        thumbnail:
          'http://books.google.com/books/content?id=BKwn_RiGFMcC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      },
      infoLink: 'https://play.google.com/store/books/details?id=BKwn_RiGFMcC&source=gbs_api',
      maturityRating: 'NOT_MATURE',
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      previewLink:
        'http://books.google.co.jp/books?id=BKwn_RiGFMcC&pg=PA83&dq=%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82&hl=&as_pt=ALLTYPES&cd=4&source=gbs_api',
      publishedDate: '2012-09-20',
      publisher: '翔泳社',
      readingModes: {
        image: true,
        text: false,
      },
      title: 'かんたんアメブロデザイン(Ameba公式ガイド)',
    },
  },
  {
    accessInfo: {
      accessViewStatus: 'SAMPLE',
      country: 'JP',
      epub: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E3%81%AA%E3%82%84%E3%81%BE%E3%82%93%E3%81%9B-sample-epub.acsm?id=ZU2FEAAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
      pdf: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E3%81%AA%E3%82%84%E3%81%BE%E3%82%93%E3%81%9B-sample-pdf.acsm?id=ZU2FEAAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
    },
    etag: '4wED9co/P5g',
    id: 'ZU2FEAAAQBAJ',
    kind: 'books#volume',
    saleInfo: {
      buyLink:
        'https://play.google.com/store/books/details?id=ZU2FEAAAQBAJ&rdid=book-ZU2FEAAAQBAJ&rdot=1&source=gbs_api',
      country: 'JP',
      listPrice: {
        amount: 77,
        currencyCode: 'JPY',
      },
      offers: [
        {
          finskyOfferType: 1,
          listPrice: {
            amountInMicros: 77000000,
            currencyCode: 'JPY',
          },
          retailPrice: {
            amountInMicros: 77000000,
            currencyCode: 'JPY',
          },
        },
      ],
      retailPrice: {
        amount: 77,
        currencyCode: 'JPY',
      },
    },
    searchInfo: {
      textSnippet:
        '... ああああああああああああオレ夢見がち別にオレが悪いわけでもないのに濡れ衣を着せられるのだああああ!!!何もやってないのだ<b>あああああ</b>まったくもってえん罪なのだぁ<b>あああ</b>ああああああああ!!!!オレは無罪なのだ<b>あああああ</b>ああああああああというか&nbsp;...',
    },
    selfLink: 'https://books.googleapis.com/books/v1/volumes/ZU2FEAAAQBAJ',
    volumeInfo: {
      allowAnonLogging: false,
      authors: ['ロドリゲス井之介'],
      canonicalVolumeLink: 'https://play.google.com/store/books/details?id=ZU2FEAAAQBAJ',
      contentVersion: '1.2.1.0.preview.3',
      description:
        '【電子書籍初登場】あの「なやまんせ」が電子書籍となって帰ってきた!! 主人公・生瀬トミヲは悩んでいる…。通勤電車の中で、目の前のギャルがパンチラしている。注意するべきか否かを悩む…。 またある休日には、会社の同僚（女）からの着信に、着信には着信で返すべきか…はたまたメールで返信するべきかを悩む…。 不器用な男の日常をロドリゲス井之介の独特な世界観で描く腹筋崩壊漫画。 全40話収録。',
      imageLinks: {
        smallThumbnail:
          'http://books.google.com/books/content?id=ZU2FEAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
        thumbnail:
          'http://books.google.com/books/content?id=ZU2FEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      },
      infoLink: 'https://play.google.com/store/books/details?id=ZU2FEAAAQBAJ&source=gbs_api',
      maturityRating: 'MATURE',
      panelizationSummary: {
        containsEpubBubbles: true,
        containsImageBubbles: true,
        epubBubbleVersion: '7d1d55bf8b936656_A',
        imageBubbleVersion: '7d1d55bf8b936656_A',
      },
      previewLink:
        'http://books.google.co.jp/books?id=ZU2FEAAAQBAJ&pg=PA218&dq=%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82&hl=&as_pt=ALLTYPES&cd=5&source=gbs_api',
      publisher: 'SMART GATE Inc.',
      readingModes: {
        image: true,
        text: true,
      },
      title: 'なやまんせ',
    },
  },
  {
    accessInfo: {
      accessViewStatus: 'SAMPLE',
      country: 'JP',
      epub: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E3%81%8B%E3%81%8E%E9%87%9D%E7%B7%A8%E3%81%BF%E3%81%AE%E5%86%86%E5%BA%A7%E3%81%A8%E8%A7%92%E5%BA%A7-sample-epub.acsm?id=Pk5IEAAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
      pdf: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E3%81%8B%E3%81%8E%E9%87%9D%E7%B7%A8%E3%81%BF%E3%81%AE%E5%86%86%E5%BA%A7%E3%81%A8%E8%A7%92%E5%BA%A7-sample-pdf.acsm?id=Pk5IEAAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
    },
    etag: 'IYnAvankF2s',
    id: 'Pk5IEAAAQBAJ',
    kind: 'books#volume',
    saleInfo: {
      buyLink:
        'https://play.google.com/store/books/details?id=Pk5IEAAAQBAJ&rdid=book-Pk5IEAAAQBAJ&rdot=1&source=gbs_api',
      country: 'JP',
      listPrice: {
        amount: 1320,
        currencyCode: 'JPY',
      },
      offers: [
        {
          finskyOfferType: 1,
          listPrice: {
            amountInMicros: 1320000000,
            currencyCode: 'JPY',
          },
          retailPrice: {
            amountInMicros: 1188000000,
            currencyCode: 'JPY',
          },
        },
      ],
      retailPrice: {
        amount: 1188,
        currencyCode: 'JPY',
      },
    },
    searchInfo: {
      textSnippet:
        '... <b>あああああ</b>ああああエメ<b>あああああ</b>上あああああああああと<b>あああああ</b>今上<b>ああああああ</b>上<b>ああああああ</b>ああああみ அ ᄇ AALALALALALO 0 H 表面と裏面を外表に合わせ表面を見ながら 2 枚一緒に編むあああああゆあ 20 015 14 0139 0129 16 1000 19 18 17&nbsp;...',
    },
    selfLink: 'https://books.googleapis.com/books/v1/volumes/Pk5IEAAAQBAJ',
    volumeInfo: {
      allowAnonLogging: false,
      authors: ['ブティック社編集部'],
      canonicalVolumeLink: 'https://play.google.com/store/books/details?id=Pk5IEAAAQBAJ',
      contentVersion: '0.2.0.0.preview.3',
      description:
        '※この商品はタブレットなど大きいディスプレイを備えた端末で読むことに適しています。また、文字だけを拡大することや、文字列のハイライト、検索、辞書の参照、引用などの機能が使用できません。 レトロな雰囲気が年代を問わず人気の手編みのおざぶ、円座と角座。この本では立体的な花モチーフから幾何学模様まで、デザイン豊富にすべて詳しい編み方つきで36点掲載。一部の作品は写真の部分解説つき。',
      imageLinks: {
        smallThumbnail:
          'http://books.google.com/books/content?id=Pk5IEAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
        thumbnail:
          'http://books.google.com/books/content?id=Pk5IEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      },
      infoLink: 'https://play.google.com/store/books/details?id=Pk5IEAAAQBAJ&source=gbs_api',
      maturityRating: 'MATURE',
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      previewLink:
        'http://books.google.co.jp/books?id=Pk5IEAAAQBAJ&pg=PA69&dq=%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82&hl=&as_pt=ALLTYPES&cd=6&source=gbs_api',
      publishedDate: '2021-10-18',
      publisher: 'ブティック社',
      readingModes: {
        image: true,
        text: true,
      },
      title: 'かぎ針編みの円座と角座',
    },
  },
  {
    accessInfo: {
      accessViewStatus: 'SAMPLE',
      country: 'JP',
      epub: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E5%A4%A9%E4%B8%8B%E7%95%8C%E3%81%AE%E7%84%A1%E4%BF%A1%E4%BB%B0%E8%80%85_%E3%82%A4%E3%83%AC%E3%82%AE%E3%83%A5%E3%83%A9-sample-epub.acsm?id=pb9PDwAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
      pdf: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E5%A4%A9%E4%B8%8B%E7%95%8C%E3%81%AE%E7%84%A1%E4%BF%A1%E4%BB%B0%E8%80%85_%E3%82%A4%E3%83%AC%E3%82%AE%E3%83%A5%E3%83%A9-sample-pdf.acsm?id=pb9PDwAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
    },
    etag: 'yLccFASPPTk',
    id: 'pb9PDwAAQBAJ',
    kind: 'books#volume',
    saleInfo: {
      country: 'JP',
    },
    searchInfo: {
      textSnippet:
        '奏せいや. 「うわ<b>あああ</b>ああああああああああああ!」ああああああああああああああああああああ!<b>あああああ</b>ああああああああ!ドン!ドン!ドン!「主!どうしました!!主ぃ!!!」「あ、いや、ごめん」ミルフィアは地獄の底にでも落とされたような顔をしてしまっ&nbsp;...',
    },
    selfLink: 'https://books.googleapis.com/books/v1/volumes/pb9PDwAAQBAJ',
    volumeInfo: {
      allowAnonLogging: false,
      authors: ['奏せいや'],
      canonicalVolumeLink:
        'https://books.google.com/books/about/%E5%A4%A9%E4%B8%8B%E7%95%8C%E3%81%AE%E7%84%A1%E4%BF%A1%E4%BB%B0%E8%80%85_%E3%82%A4%E3%83%AC%E3%82%AE%E3%83%A5%E3%83%A9.html?hl=&id=pb9PDwAAQBAJ',
      contentVersion: '1.2.3.0.preview.3',
      description:
        'ウリエルから絶縁を言い渡され炎まで浴びせられた神愛。落ち込む彼だったがミルフィアたちの励ましにより立ち上がる。 いつでも友であるという約束を果たすために。神愛は人類の未来をかけた戦争に赴いていく。それは人類のためでもなく、世界の平和のためでもない。 ただ、大切な友人と喧嘩をするためだった。 その頃七大天羽であるサリエルも彼の想いを燃やしていた。それは二千年前の決着、ウリエルとの再戦だった。 ウリエル対サリエルの壮絶な死闘。 そして人類と天羽による戦争が始まり、首都ヴァチカンは戦場へと変わる。 世界はどうなるのか。神愛は恵瑠を無事連れ戻し、ウリエルの祈りは届くのか。 戦いはついに決戦へ。慈愛連立編第五巻、発売開始！',
      imageLinks: {
        smallThumbnail:
          'http://books.google.com/books/content?id=pb9PDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
        thumbnail:
          'http://books.google.com/books/content?id=pb9PDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      },
      infoLink:
        'http://books.google.co.jp/books?id=pb9PDwAAQBAJ&dq=%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82&hl=&as_pt=ALLTYPES&source=gbs_api',
      maturityRating: 'NOT_MATURE',
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      previewLink:
        'http://books.google.co.jp/books?id=pb9PDwAAQBAJ&pg=PT32&dq=%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82&hl=&as_pt=ALLTYPES&cd=7&source=gbs_api',
      publishedDate: '2017-10-22',
      publisher: '電書バト',
      readingModes: {
        image: true,
        text: true,
      },
      title: '天下界の無信仰者（イレギュラー）　5巻　慈愛連立編',
    },
  },
  {
    accessInfo: {
      accessViewStatus: 'SAMPLE',
      country: 'JP',
      epub: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E3%83%89%E3%82%A4%E3%83%84%E8%BB%8D%E5%8F%AC%E5%96%9A%E3%83%83_%E5%8B%87%E8%80%85%E9%81%94%E3%81%AB%E5%85%A8%E3%81%A6-sample-epub.acsm?id=khutEAAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
      pdf: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E3%83%89%E3%82%A4%E3%83%84%E8%BB%8D%E5%8F%AC%E5%96%9A%E3%83%83_%E5%8B%87%E8%80%85%E9%81%94%E3%81%AB%E5%85%A8%E3%81%A6-sample-pdf.acsm?id=khutEAAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
    },
    etag: 'KvnVNqaPx9w',
    id: 'khutEAAAQBAJ',
    kind: 'books#volume',
    saleInfo: {
      buyLink:
        'https://play.google.com/store/books/details?id=khutEAAAQBAJ&rdid=book-khutEAAAQBAJ&rdot=1&source=gbs_api',
      country: 'JP',
      listPrice: {
        amount: 1320,
        currencyCode: 'JPY',
      },
      offers: [
        {
          finskyOfferType: 1,
          listPrice: {
            amountInMicros: 1320000000,
            currencyCode: 'JPY',
          },
          retailPrice: {
            amountInMicros: 1188000000,
            currencyCode: 'JPY',
          },
        },
      ],
      retailPrice: {
        amount: 1188,
        currencyCode: 'JPY',
      },
    },
    searchInfo: {
      textSnippet:
        '... <b>あああああ</b>ああああああああ!!最強の貫通力を見せてやるぁぁぁ<b>あああ</b>ああああああああああああ!!!」ツムシィーセン発射用 11111111 意ッ!!クィィィィイイイン.................. ――図体がデカいだけで勝てると思うなよぉぉおお!!!そう言うや否や、先手&nbsp;...',
    },
    selfLink: 'https://books.googleapis.com/books/v1/volumes/khutEAAAQBAJ',
    volumeInfo: {
      allowAnonLogging: true,
      authors: ['LA軍', '山椒魚'],
      canonicalVolumeLink: 'https://play.google.com/store/books/details?id=khutEAAAQBAJ',
      contentVersion: '0.1.2.0.preview.3',
      description:
        '国王と勇者を倒し、元妻に復讐を果たしたナセルは、残された唯一の家族、リズを奪還するため魔王軍との最前線に赴く。 満身創痍の彼に手を貸したのは、かつての敵・魔法兵団元帥バンメルだった！ そして、召喚した降下猟兵とともに王国軍駐屯地を急襲したナセルはリズを探すうちに“あの人物”が生存しているという事実にたどり着く。 魔女狩りの嵐が吹き荒れる前線都市で、ナセルは王国軍最強戦力を鏖殺し、愛する者たちを取り戻すことができるのか──！ Me262、ティーガーII、超重戦車マウス──続々登場のドイツ軍最強兵器！ 異世界電撃戦が新章突入!!',
      imageLinks: {
        smallThumbnail:
          'http://books.google.com/books/content?id=khutEAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
        thumbnail:
          'http://books.google.com/books/content?id=khutEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      },
      infoLink: 'https://play.google.com/store/books/details?id=khutEAAAQBAJ&source=gbs_api',
      maturityRating: 'NOT_MATURE',
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      previewLink:
        'http://books.google.co.jp/books?id=khutEAAAQBAJ&pg=PT137&dq=%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82&hl=&as_pt=ALLTYPES&cd=8&source=gbs_api',
      publishedDate: '2023-02-15',
      publisher: 'アース・スター エンターテイメント',
      readingModes: {
        image: true,
        text: true,
      },
      seriesInfo: {
        bookDisplayNumber: '3',
        kind: 'books#volume_series_info',
        volumeSeries: [
          {
            orderNumber: 3,
            seriesBookType: 'COLLECTED_EDITION',
            seriesId: '0iAuGwAAABD9OM',
          },
        ],
      },
      title: 'ドイツ軍召喚ッ！　～勇者達に全てを奪われたドラゴン召喚士、元最強は復讐を誓う～３',
    },
  },
  {
    accessInfo: {
      accessViewStatus: 'SAMPLE',
      country: 'JP',
      epub: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E3%81%82%E3%81%AA%E3%81%9F%E3%81%AB%E7%A7%98%E3%82%81%E3%82%89%E3%82%8C%E3%81%9F%E6%89%8D%E8%83%BD%E3%81%AF_%E6%BD%9C-sample-epub.acsm?id=kchMDwAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
      pdf: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E3%81%82%E3%81%AA%E3%81%9F%E3%81%AB%E7%A7%98%E3%82%81%E3%82%89%E3%82%8C%E3%81%9F%E6%89%8D%E8%83%BD%E3%81%AF_%E6%BD%9C-sample-pdf.acsm?id=kchMDwAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
    },
    etag: 'FaxEh2ZZqtk',
    id: 'kchMDwAAQBAJ',
    kind: 'books#volume',
    saleInfo: {
      buyLink:
        'https://play.google.com/store/books/details?id=kchMDwAAQBAJ&rdid=book-kchMDwAAQBAJ&rdot=1&source=gbs_api',
      country: 'JP',
      listPrice: {
        amount: 99,
        currencyCode: 'JPY',
      },
      offers: [
        {
          finskyOfferType: 1,
          listPrice: {
            amountInMicros: 99000000,
            currencyCode: 'JPY',
          },
          retailPrice: {
            amountInMicros: 99000000,
            currencyCode: 'JPY',
          },
        },
      ],
      retailPrice: {
        amount: 99,
        currencyCode: 'JPY',
      },
    },
    searchInfo: {
      textSnippet:
        '... ああああああああつ<b>ああああああ</b>なああああああああああああああああああああああああああああああああああああああああああああああああああああああああり<b>あああ</b>ああああまあ<b>あああああ</b>ああああああああああああああああ 第 2 章注意力 35 36 この章では.',
    },
    selfLink: 'https://books.googleapis.com/books/v1/volumes/kchMDwAAQBAJ',
    volumeInfo: {
      allowAnonLogging: false,
      authors: ['潜在能力テスト'],
      canonicalVolumeLink: 'https://play.google.com/store/books/details?id=kchMDwAAQBAJ',
      contentVersion: '1.3.1.0.preview.3',
      description:
        '※この商品はタブレットなど大きいディスプレイを備えた端末で読むことに適しています。また、文字だけを拡大することや、文字列のハイライト、検索、辞書の参照、引用などの機能が使用できません。 大人から子どもまで、みんなで夢中になれる人気番組『潜在能力テスト』が本になって登場。ユニークな問題で楽しく脳力をみがこう!! 「知識」「学歴」「年齢」関係なく盛り上がれると話題を集めている、フジテレビ系の人気番組『潜在能力テスト』が本になりました。 番組でおなじみのカテゴリーより、「日常観察力」「注意力」「だまされない力」「言葉のセンス」「判断力」「超快感テスト」の問題を厳選。さらに、「ひっかけロシアンルーレット」が遊べるカードもついた、大満足の一冊です。 多種多彩な問題を解き進めるうちに、学校のテストでは分からない、秘められた才能に気付くかも!? ※この電子版には紙版に付属する「【巻末特別付録】ひっかけロシアンカード」は付属しておりません、ご希望の方は紙版をご購入ください。 ※この商品はカラー表示のできる端末でご使用ください。',
      imageLinks: {
        smallThumbnail:
          'http://books.google.com/books/content?id=kchMDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
        thumbnail:
          'http://books.google.com/books/content?id=kchMDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      },
      infoLink: 'https://play.google.com/store/books/details?id=kchMDwAAQBAJ&source=gbs_api',
      maturityRating: 'NOT_MATURE',
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      previewLink:
        'http://books.google.co.jp/books?id=kchMDwAAQBAJ&pg=PA34&dq=%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82&hl=&as_pt=ALLTYPES&cd=9&source=gbs_api',
      publishedDate: '2018-02-09',
      publisher: '扶桑社',
      readingModes: {
        image: true,
        text: true,
      },
      title: 'あなたに秘められた才能は？　潜在能力テスト 公式問題集',
    },
  },
  {
    accessInfo: {
      accessViewStatus: 'SAMPLE',
      country: 'JP',
      epub: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E7%94%9F%E3%81%BE%E3%82%8C%E3%81%9F%E7%9B%B4%E5%BE%8C%E3%81%AB%E6%8D%A8%E3%81%A6%E3%82%89%E3%82%8C%E3%81%9F%E3%81%91-sample-epub.acsm?id=dWuAEAAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
      pdf: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E7%94%9F%E3%81%BE%E3%82%8C%E3%81%9F%E7%9B%B4%E5%BE%8C%E3%81%AB%E6%8D%A8%E3%81%A6%E3%82%89%E3%82%8C%E3%81%9F%E3%81%91-sample-pdf.acsm?id=dWuAEAAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
    },
    etag: '5MVEjzzx1hE',
    id: 'dWuAEAAAQBAJ',
    kind: 'books#volume',
    saleInfo: {
      buyLink:
        'https://play.google.com/store/books/details?id=dWuAEAAAQBAJ&rdid=book-dWuAEAAAQBAJ&rdot=1&source=gbs_api',
      country: 'JP',
      listPrice: {
        amount: 1320,
        currencyCode: 'JPY',
      },
      offers: [
        {
          finskyOfferType: 1,
          listPrice: {
            amountInMicros: 1320000000,
            currencyCode: 'JPY',
          },
          retailPrice: {
            amountInMicros: 1188000000,
            currencyCode: 'JPY',
          },
        },
      ],
      retailPrice: {
        amount: 1188,
        currencyCode: 'JPY',
      },
    },
    searchInfo: {
      textSnippet:
        '... <b>あああああ</b>ああああああああマスター<b>ああああああ</b>あああああっ!会いたかった会いたかった会いたかった会いたかった<b>ああああああ</b>あああああああああっ!』純白な聖竜杖リントヴルムとは対照的な、漆黒の杖である。それが勢いよく突進してきて、俺は押し&nbsp;...',
    },
    selfLink: 'https://books.googleapis.com/books/v1/volumes/dWuAEAAAQBAJ',
    volumeInfo: {
      allowAnonLogging: true,
      authors: ['九頭七尾', '鍋島テツヒロ'],
      canonicalVolumeLink: 'https://play.google.com/store/books/details?id=dWuAEAAAQBAJ',
      contentVersion: '1.2.3.0.preview.3',
      description:
        '名家に生まれたものの、魔力測定器のミスで生後すぐ捨てられたレウス。 魔物と冒険者のおっぱいを糧に少し成長し（とはいえまだまだ赤ちゃん）、とりあえずＢランクまで昇格。 レウスの治療でパワーアップしたファナやアンジェ、新たな杖と次の街へ!? 二人のAランク昇格試験に付き添うことに。 そこへ反冒険者ギルド組織なる襲撃者が現れ──',
      imageLinks: {
        smallThumbnail:
          'http://books.google.com/books/content?id=dWuAEAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
        thumbnail:
          'http://books.google.com/books/content?id=dWuAEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      },
      infoLink: 'https://play.google.com/store/books/details?id=dWuAEAAAQBAJ&source=gbs_api',
      maturityRating: 'NOT_MATURE',
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      previewLink:
        'http://books.google.co.jp/books?id=dWuAEAAAQBAJ&pg=PT21&dq=%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82&hl=&as_pt=ALLTYPES&cd=10&source=gbs_api',
      publishedDate: '2022-08-18',
      publisher: 'アース・スター エンターテイメント',
      readingModes: {
        image: true,
        text: true,
      },
      seriesInfo: {
        bookDisplayNumber: '2',
        kind: 'books#volume_series_info',
        volumeSeries: [
          {
            orderNumber: 2,
            seriesBookType: 'COLLECTED_EDITION',
            seriesId: 'Y1QuGwAAABBMTM',
          },
        ],
      },
      title: '生まれた直後に捨てられたけど、前世が大賢者だったので余裕で生きてます２',
    },
  },
  {
    accessInfo: {
      accessViewStatus: 'SAMPLE',
      country: 'JP',
      epub: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E7%A5%9E%E8%A9%B1%E4%B8%96%E7%95%8C%E3%81%AE%E3%83%97%E3%83%AD%E3%83%AD%E3%83%BC%E3%82%B0-sample-epub.acsm?id=3YK3DwAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
      pdf: {
        acsTokenLink:
          'http://books.google.co.jp/books/download/%E7%A5%9E%E8%A9%B1%E4%B8%96%E7%95%8C%E3%81%AE%E3%83%97%E3%83%AD%E3%83%AD%E3%83%BC%E3%82%B0-sample-pdf.acsm?id=3YK3DwAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        isAvailable: true,
      },
    },
    etag: '5cFCN7EqHiw',
    id: '3YK3DwAAQBAJ',
    kind: 'books#volume',
    saleInfo: {
      buyLink:
        'https://play.google.com/store/books/details?id=3YK3DwAAQBAJ&rdid=book-3YK3DwAAQBAJ&rdot=1&source=gbs_api',
      country: 'JP',
      listPrice: {
        amount: 550,
        currencyCode: 'JPY',
      },
      offers: [
        {
          finskyOfferType: 1,
          listPrice: {
            amountInMicros: 550000000,
            currencyCode: 'JPY',
          },
          retailPrice: {
            amountInMicros: 495000000,
            currencyCode: 'JPY',
          },
        },
      ],
      retailPrice: {
        amount: 495,
        currencyCode: 'JPY',
      },
    },
    searchInfo: {
      textSnippet:
        '... ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ<b>あああああ</b>ああああああああああああ!」 「早く治癒魔法を!」と、リリス.',
    },
    selfLink: 'https://books.googleapis.com/books/v1/volumes/3YK3DwAAQBAJ',
    volumeInfo: {
      allowAnonLogging: false,
      authors: ['杉村修'],
      canonicalVolumeLink: 'https://play.google.com/store/books/details?id=3YK3DwAAQBAJ',
      contentVersion: '0.1.2.0.preview.3',
      description:
        '「ああ聖なるかな、聖なるかな。 天から落ちし賢きものよ。神の頂きを目指したもの かつてお前は心に誓った かならずや神の玉座に座ることを」 これは神話世界、『最後』で『最初』の物語……。 神話をテーマにしたSFファンタジー作品中編。 VRヘッドセット型の宝具で神霊界に向かう式部蓮は、そこで世界の敵アイオーンと戦い続ける。 「さあ、始めよう」 蓮が勢いよく剣を振ると、大気がはじけた。 イラスト／ノブメ',
      imageLinks: {
        smallThumbnail:
          'http://books.google.com/books/content?id=3YK3DwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
        thumbnail:
          'http://books.google.com/books/content?id=3YK3DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      },
      infoLink: 'https://play.google.com/store/books/details?id=3YK3DwAAQBAJ&source=gbs_api',
      maturityRating: 'NOT_MATURE',
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      previewLink:
        'http://books.google.co.jp/books?id=3YK3DwAAQBAJ&pg=PT26&dq=%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82&hl=&as_pt=ALLTYPES&cd=11&source=gbs_api',
      publishedDate: '2019-03-13',
      publisher: 'マイナビ出版',
      readingModes: {
        image: true,
        text: true,
      },
      title: '神話世界のプロローグ',
    },
  },
];

function post(): z.infer<typeof PostSchemaOutput> {
  const i = faker.number.int({
    max: volume_list.length - 1,
  });
  const volume = volume_list[i]!;
  return {
    post_id: faker.number.int(),
    toukousya_id: faker.number.int(),
    volume_id: volume.id,
    volume: volume,
    book_title: faker.book.title(),
    post_title: faker.lorem.sentence(),
    content: JSON.stringify([
      ...([
        {
          insert: faker.lorem.paragraph() + '\n\n',
          attributes: { header: 1 },
        },
        { insert: faker.lorem.sentences() + '\n' },
        { insert: faker.lorem.sentences() + '\n' },
        { insert: faker.lorem.sentences() + '\n\n' },
      ] satisfies Op[]),
      ...R.range(1, faker.number.int({ max: 5 }))
        .map(
          () =>
            [
              {
                insert: faker.lorem.paragraph() + '\n\n',
                attributes: { header: 2 },
              },
              { insert: faker.lorem.sentences() + '\n' },
              { insert: faker.lorem.sentences() + '\n' },
              { insert: faker.lorem.sentences() + '\n\n' },
            ] satisfies Op[],
        )
        .flat(),
    ]),
    published: true,
    published_at: faker.date.anytime(),
    hearts: faker.number.int({ max: 1000 }),
    created_at: faker.date.anytime(),
    updated_at: faker.date.anytime(),

    toukousya: profile(),
  };
}

function profile(): z.infer<typeof OutputProfileSchema> {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    twofa_enable: false,
    description: faker.internet.displayName(),
    avatar_image: faker.image.avatar(),
  };
}

function readingrecord(): z.infer<typeof ReadingrecordSchema> {
  const i = faker.number.int({
    max: volume_list.length - 1,
  });
  const volume = volume_list[i]!;
  return {
    readingrecord_id: faker.number.int(),
    volume_id: volume.id,
    book_title: faker.book.title(),
    hitokoto: faker.lorem.sentences(),
    read_date: '',
    star: faker.number.int({ max: 5 }),
    user_id: faker.number.int(),
    created_at: new Date(),
    updated_at: new Date(),
  };
}

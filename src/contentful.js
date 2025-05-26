import { createClient } from 'contentful';

const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_DELIVERY_TOKEN,
});

export const fetchBlogPosts = async () => {
  const res = await client.getEntries({ content_type: 'blogPost' });
  const assets = res.includes?.Asset || [];

  return res.items.map((item) => {
    const imageId = item.fields.coverImage?.[0]?.sys?.id;
    const imageAsset = assets.find((a) => a.sys.id === imageId);
    return {
      ...item.fields,
      id: item.sys.id,
      coverImageUrl: imageAsset?.fields?.file?.url
        ? "https:" + imageAsset.fields.file.url
        : null,
    };
  });
};

export const serializeNews = (news) => ({
    id: news._id,
    slug: news.slug,
    headline: news.headline,
    content: news.content,
    category: news.category,
    // Note: Assuming categorySlug might be needed if joined, 
    // but for now using the category name/string from model
    categorySlug: news.categorySlug || news.category, 
    imageSrc: news.imageSrc,
    imageCaption: news.imageCaption,
    reporterInfo: news.reporterInfo,
    publishedAt: news.publishedAt,
    isFeatured: news.isFeatured,
    status: news.status,
    metaTitle: news.metaTitle,
    metaDescription: news.metaDescription,
    viewsCount: news.viewsCount,
    authorName: news.authorName || (news.authorId && typeof news.authorId === 'object' ? news.authorId.name : null),
    tags: news.tags || [],
});

export const serializeCategory = (category) => ({
    id: category._id,
    name: category.name,
    slug: category.slug,
});

export const serializeSetting = (setting) => ({
    key: setting.key,
    value: setting.value,
});

export const serializeLogo = (logo) => ({
    logoUrl: logo.logoUrl,
});

export const serializeMenu = (menu) => ({
    id: menu._id,
    label: menu.label,
    href: menu.href,
    order: menu.order,
    isExternal: menu.isExternal,
});

export const serializeMember = (member) => ({
    id: member._id,
    name: member.name,
    designation: member.designation,
    image: member.image,
    section: member.section,
    isHead: member.isHead,
    order: member.order,
});

export const serializeVideo = (video) => ({
    id: video._id,
    title: video.title,
    youtubeUrl: video.youtubeUrl,
    videoId: video.videoId,
});

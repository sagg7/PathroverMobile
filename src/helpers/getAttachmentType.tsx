export function identifyAttachmentTypeFromUrl(url) {
  const extension = url?.split('.')?.pop()?.toLowerCase()?.split(/[#?]/)[0];

  const typeMap = {
    // Images
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    bmp: 'image',
    webp: 'image',
    svg: 'image',
    heic: 'image',
    tiff: 'image',

    // Videos
    mp4: 'video',
    mkv: 'video',
    avi: 'video',
    mov: 'video',
    wmv: 'video',
    flv: 'video',
    webm: 'video',

    // Audio
    mp3: 'audio',
    wav: 'audio',
    ogg: 'audio',
    m4a: 'audio',
    flac: 'audio',
    aac: 'audio',

    // Documents
    pdf: 'document',
    doc: 'document',
    docx: 'document',
    xls: 'document',
    xlsx: 'document',
    ppt: 'document',
    pptx: 'document',
    txt: 'document',
    csv: 'document',
    odt: 'document',
    ods: 'document',

    // Archives
    zip: 'archive',
    rar: 'archive',
    tar: 'archive',
    gz: 'archive',
    '7z': 'archive',
    iso: 'archive',
  };

  return typeMap[extension] || 'unknown';
}

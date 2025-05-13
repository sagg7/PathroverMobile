export function identifyAttachmentTypeFromUrl(contentType) {
  // Mapping of MIME types to categories
  const categoryMap = {
    // Images
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image',
    'image/bmp': 'image',
    'image/webp': 'image',
    'image/svg+xml': 'image',
    'image/heic': 'image',
    'image/tiff': 'image',

    // Videos
    'video/mp4': 'video',
    'video/x-matroska': 'video', // .mkv
    'video/x-msvideo': 'video', // .avi
    'video/quicktime': 'video', // .mov
    'video/x-ms-wmv': 'video', // .wmv
    'video/x-flv': 'video', // .flv
    'video/webm': 'video',

    // Audio
    'audio/mpeg': 'audio', // .mp3
    'audio/wav': 'audio',
    'audio/ogg': 'audio',
    'audio/mp4': 'audio', // .m4a
    'audio/flac': 'audio',
    'audio/aac': 'audio',
    'audio/m4a': 'audio',

    // Documents
    'application/pdf': 'document',
    'application/msword': 'document', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'document', // .docx
    'application/vnd.ms-excel': 'document', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      'document', // .xlsx
    'application/vnd.ms-powerpoint': 'document', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      'document', // .pptx
    'text/plain': 'document', // .txt
    'text/csv': 'document', // .csv
    'application/vnd.oasis.opendocument.text': 'document', // .odt
    'application/vnd.oasis.opendocument.spreadsheet': 'document', // .ods
    'application/x-ole-storage': 'document', // OLE storage (e.g., .doc, .xls, .ppt)
  };

  // Check if the content_type is in the categoryMap
  if (categoryMap[contentType]) {
    return categoryMap[contentType];
  }

  // Fallback: Check if the content_type starts with a known prefix
  if (contentType.startsWith('image/')) {
    return 'image';
  }
  if (contentType.startsWith('video/')) {
    return 'video';
  }
  if (contentType.startsWith('audio/')) {
    return 'audio';
  }
  if (
    contentType.startsWith('application/') ||
    contentType.startsWith('text/')
  ) {
    return 'document';
  }

  // If no match, return 'unknown'
  return 'unknown';
}

// export function identifyAttachmentTypeFromUrl(url) {
//   const extension = url?.split('.')?.pop()?.toLowerCase()?.split(/[#?]/)[0];

//   const typeMap = {
//     // Images
//     jpg: 'image',
//     jpeg: 'image',
//     png: 'image',
//     gif: 'image',
//     bmp: 'image',
//     webp: 'image',
//     svg: 'image',
//     heic: 'image',
//     tiff: 'image',

//     // Videos
//     mp4: 'video',
//     mkv: 'video',
//     avi: 'video',
//     mov: 'video',
//     wmv: 'video',
//     flv: 'video',
//     webm: 'video',

//     // Audio
//     mp3: 'audio',
//     wav: 'audio',
//     ogg: 'audio',
//     m4a: 'audio',
//     flac: 'audio',
//     aac: 'audio',

//     // Documents
//     pdf: 'document',
//     doc: 'document',
//     docx: 'document',
//     xls: 'document',
//     xlsx: 'document',
//     ppt: 'document',
//     pptx: 'document',
//     txt: 'document',
//     csv: 'document',
//     odt: 'document',
//     ods: 'document',

//     // Archives
//     zip: 'archive',
//     rar: 'archive',
//     tar: 'archive',
//     gz: 'archive',
//     '7z': 'archive',
//     iso: 'archive',
//   };

//   return typeMap[extension] || 'unknown';
// }

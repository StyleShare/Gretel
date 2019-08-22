export function onExportSlices(context) {
  const exports = context.actionContext.exports

  exports.forEach(exportData => {
    const name = exportData.request.name() // e.g. 'ic/like/fill/16@2x'
    const format = exportData.request.format() // e.g. '.png'
    if (!name.includes('/')) {
      return
    }

    const relativePath = `${name}.${format}` // e.g. 'ic/like/fill/16@2x.png'
    const absolutePath = exportData.path // e.g. '/path/to/ic/like/fill/16@2x.png'
    const basePath = absolutePath.split(relativePath)[0] // e.g. '/path/to/'

    const flattenedName = relativePath.replace(/\//g, '_')
    const newAbsolutePath = basePath + flattenedName
    const oldAbsolutePath = absolutePath

    const fileManager = NSFileManager.defaultManager()
    if (fileManager.fileExistsAtPath(newAbsolutePath)) {
      fileManager.removeItemAtPath_error(newAbsolutePath, null)
    }

    const error = MOPointer.alloc().init()
    fileManager.moveItemAtPath_toPath_error(oldAbsolutePath, newAbsolutePath, error)
  });
}

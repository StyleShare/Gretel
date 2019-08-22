import { onExportSlices } from '../src/gretel'

beforeEach(() => {
  prepareFixtures()
});

afterEach(() => {
  removeFixtures()
});

function prepareFixtures() {
  const iconsDirectoryUrl = getIconsDirectoryUrl()
  const relativeDirectoryPaths = [
    ['ic', 'avatar', 'fill'],
    ['ic', 'avatar', 'line'],
    ['ic', 'feed', 'fill'],
    ['ic', 'feed', 'line'],
    ['ic', 'notification', 'fill'],
    ['ic', 'notification', 'line'],
    ['ic', 'store', 'fill'],
    ['ic', 'store', 'line'],
  ]
  const scales = ['', '@2x', '@3x']

  relativeDirectoryPaths.forEach(pathComponents => {
    let directoryUrl = joinUrl(iconsDirectoryUrl, pathComponents)
    createDirectory(directoryUrl)

    scales.forEach(scale => {
      const fileUrl = joinUrl(directoryUrl, [`24${scale}.png`])
      createFile(fileUrl)
    })
  })
}

function removeFixtures() {
  const fileManager = NSFileManager.defaultManager()
  fileManager.removeItemAtURL_error(getFixtureDirectoryUrl(), null)
}

function getFixtureDirectoryUrl() {
  const fileManager = NSFileManager.defaultManager()
  const currentDirectoryURL = NSURL.fileURLWithPath(fileManager.currentDirectoryPath())
  return currentDirectoryURL.URLByAppendingPathComponent('fixture')
}

function getIconsDirectoryUrl() {
  return joinUrl(getFixtureDirectoryUrl(), ['icons'])
}

function joinUrl(url, pathComponents) {
  let newUrl = url
  pathComponents.forEach(pathComponent => {
    newUrl = newUrl.URLByAppendingPathComponent(pathComponent)
  })
  return newUrl
}

function createDirectory(url) {
  const fileManager = NSFileManager.defaultManager()
  fileManager.createDirectoryAtURL_withIntermediateDirectories_attributes_error(
    url, true, null, null
  )
}

function createFile(url) {
  const fileManager = NSFileManager.defaultManager()
  fileManager.createFileAtPath_contents_attributes(url.path(), null, null)
}

test('it flattens resource files', () => {
  // given
  const context = {
    actionContext: {
      exports: [
        getExportData('ic/avatar/fill/24.png'),
        getExportData('ic/avatar/fill/24@2x.png'),
        getExportData('ic/avatar/fill/24@3x.png'),
        getExportData('ic/avatar/line/24.png'),
        getExportData('ic/avatar/line/24@2x.png'),
        getExportData('ic/avatar/line/24@3x.png'),
        getExportData('ic/feed/fill/24.png'),
        getExportData('ic/feed/fill/24@2x.png'),
        getExportData('ic/feed/fill/24@3x.png'),
        getExportData('ic/feed/line/24.png'),
        getExportData('ic/feed/line/24@2x.png'),
        getExportData('ic/feed/line/24@3x.png'),
        getExportData('ic/notification/fill/24.png'),
        getExportData('ic/notification/fill/24@2x.png'),
        getExportData('ic/notification/fill/24@3x.png'),
        getExportData('ic/notification/line/24.png'),
        getExportData('ic/notification/line/24@2x.png'),
        getExportData('ic/notification/line/24@3x.png'),
        getExportData('ic/store/fill/24.png'),
        getExportData('ic/store/fill/24@2x.png'),
        getExportData('ic/store/fill/24@3x.png'),
        getExportData('ic/store/line/24.png'),
        getExportData('ic/store/line/24@2x.png'),
        getExportData('ic/store/line/24@3x.png'),
      ]
    }
  }

  // when
  onExportSlices(context)

  // then
  const expectedFilenames = [
    'ic_avatar_fill_24.png',
    'ic_avatar_fill_24@2x.png',
    'ic_avatar_fill_24@3x.png',
    'ic_avatar_line_24.png',
    'ic_avatar_line_24@2x.png',
    'ic_avatar_line_24@3x.png',
    'ic_feed_fill_24.png',
    'ic_feed_fill_24@2x.png',
    'ic_feed_fill_24@3x.png',
    'ic_feed_line_24.png',
    'ic_feed_line_24@2x.png',
    'ic_feed_line_24@3x.png',
    'ic_notification_fill_24.png',
    'ic_notification_fill_24@2x.png',
    'ic_notification_fill_24@3x.png',
    'ic_notification_line_24.png',
    'ic_notification_line_24@2x.png',
    'ic_notification_line_24@3x.png',
    'ic_store_fill_24.png',
    'ic_store_fill_24@2x.png',
    'ic_store_fill_24@3x.png',
    'ic_store_line_24.png',
    'ic_store_line_24@2x.png',
    'ic_store_line_24@3x.png',
  ]

  const fileManager = NSFileManager.defaultManager()
  const iconsDirectoryUrl = getIconsDirectoryUrl()

  expectedFilenames.forEach(filename => {
    const url = joinUrl(iconsDirectoryUrl, [filename])
    const exists = fileManager.fileExistsAtPath(url.path())
    expect(exists).toBeTruthy()
  })
});

function getExportData(filename) {
  const [name, format] = filename.split('.')
  const path = joinUrl(getIconsDirectoryUrl(), filename.split('/')).path()
  return {
    request: new StubExportRequest(name, format),
    path: path,
  }
}

class StubExportRequest {
  constructor(name, format) {
    this._name = name
    this._format = format
  }

  name() {
    return this._name
  }

  format() {
    return this._format
  }
}

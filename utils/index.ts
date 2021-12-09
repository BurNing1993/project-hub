import dayjs from "dayjs"

/**
 * 下载blob文件
 * @param blob 
 * @param fileName 
 */
export function downloadBlob(blob: Blob, fileName: string) {
    const blobUrl = window.URL.createObjectURL(blob)
    const downloadLink = document.createElement('a')
    downloadLink.download = fileName
    downloadLink.style.display = 'none'
    downloadLink.href = blobUrl
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
}

export function exportJsonFile(content: object) {
    const str = JSON.stringify(content, null, 2)
    const blob = new Blob([str], { type: 'application/json' })
    const fileName = `project_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.json`
    downloadBlob(blob, fileName)
}
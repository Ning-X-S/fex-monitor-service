
// 快排
function quickSort (arr) {
  if (arr.length <= 1) {
    return arr
  }
  const pivotIndex = Math.floor(arr.length / 2)
  const pivot = arr.splice(pivotIndex, 1)[0]
  const pivotNum = new Date(pivot.recent_items.hits.hits[0]._source.dateTime).getTime()
  console.log(pivot)
  const left = []
  const right = []
  for (var i = 0; i < arr.length; i++) {
    if (new Date(arr[i].recent_items.hits.hits[0]._source.dateTime).getTime() < pivotNum) {
      right.push(arr[i])
    } else {
      left.push(arr[i])
    }
  }
  return quickSort(left).concat([pivot], quickSort(right))
}

// map最初数据
function initMapData () {
  let timeStamp = new Date()
  const result = []
  for (let i = 0; i < 24; i++) {
    const year = timeStamp.getFullYear().toString()
    const mouth = ((timeStamp.getMonth() + 1).toString()).padStart(2, '0')
    const days = (timeStamp.getDate().toString()).padStart(2, '0')
    const hours = (timeStamp.getHours().toString()).padStart(2, '0')
    const time = `${year}-${mouth}-${days} ${hours}`
    timeStamp = new Date(timeStamp.getTime() - 60 * 60 * 1000)
    result.push({
      time,
      events: 0
    })
  }
  return result
}

// 构建真实map数据
function initItemsMapData (data, buckets) {
  const result = JSON.parse(JSON.stringify(data))
  result.forEach((dataItem, index) => {
    const idx = buckets.findIndex((item) => item.key === dataItem.time)
    if (idx > -1) {
      result[index].events = buckets[idx].doc_count
    }
  })
  return result
}

module.exports = {
  quickSort,
  initMapData,
  initItemsMapData
}

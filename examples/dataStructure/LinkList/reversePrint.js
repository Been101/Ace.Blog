function reverse_print(head) {
  if(!head) {
    console.log(null)
    return null
  }
  reverse_print(head.next) // 甩锅
  console.log(head.data) // 甩锅完成后， 该打印自己了
}
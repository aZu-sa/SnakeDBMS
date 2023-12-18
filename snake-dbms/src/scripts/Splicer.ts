export function splicer (key: string | Array<string>, split: string) : string {
  if (key instanceof Array) {
    return key.join(split)
  }
  return key
}

export function conditionSplicer (where: string | Array<string>) : string {
  return splicer(where, ' AND')
}
export function attrSplicer (what: string | Array<string>) : string {
  return splicer(what, ', ')
}

export function valuesSplicer (values: Array<Array<string>>) : string {
  const resArr = []
  for (let i = 0; i < values.length; i++) {
    resArr.push('(' + splicer(values[i], ', ') + ')')
  }
  return splicer(resArr, ', ')
}

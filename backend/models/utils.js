exports.toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

exports.roundOffGWA = (num) => +(Math.round(num + "e+4")  + "e-4")
// -----------------------------------------------------------------
function Util_CompareForSortBySDKVersion(a, b) {
  // [in]  semantic version string "major.minor.micro"
  // [out] Number (major * 1000^2 + minor * 1000 + micro)
  function GetVersion(strVer) {
    var tmp = strVer.split('.');
    var result =
        parseInt(tmp[0], 10) * 1000 * 1000
      + parseInt(tmp[1], 10) * 1000
      + parseInt(tmp[2], 10)
    return result
  }

  var aa = GetVersion(a['NXAddon']);
  var bb = GetVersion(b['NXAddon']);
  if (aa < bb) { return 1; }
  else if (aa > bb) { return -1; }
  else { return 0; }
}

function MakeTableImpl(column, id) {
  var tmp = version_table.sort(Util_CompareForSortBySDKVersion);
  // console.log(tmp);

  // column の順に要素を整列
  var tmp2 = tmp.map(function(e) {
    var a = [];
    for (var i = 0; i < column.length; i++) {
      a.push(e[column[i]]);
    }
    return a;
  });

  var div = $('#' + id);
  var brother = div.next();
  var tagName = div.parent().prop('tagName').toUpperCase()

  if (tagName == 'MACRO') {
      brother = div.parent().next();
      // なにかのタイミングで、見出しとテーブルの間に下記のようなタグが入ることがあるため、それを回避する。
      // <p class="auto-cursor-target"> <br> </p>
      
      tagName = brother.prop('tagName') .toUpperCase()
      if (tagName != 'TABLE') {
        brother = brother.next();
      }
  }

  var parent = $('tbody', brother);
  for (var i = 0; i < tmp2.length; i++) {
    var str = '<tr><td class="confluenceTd">' + tmp2[i].join('</td><td class="confluenceTd">') + '</td></tr>';
    parent.append(str);    
  }
}

function MakeTable() {
  for (var key in CategoryTableAndColumn) {
    // console.log('[KEY]', key, '[DATA]', CategoryTableAndColumn[key]);
    MakeTableImpl(CategoryTableAndColumn[key], key)
  }
}
MakeTable();

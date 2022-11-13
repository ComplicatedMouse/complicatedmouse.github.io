var SearchApi = function(){};

SearchApi.escapeRegex = function(str)
{
  if (str == null)
    return "";
  if (typeof(str) != "string")
    return "";
  var ret = str;
  ret = ret.replace(/\\/g, "\\\\");
  ret = ret.replace(/\^/g, "\\^");
  ret = ret.replace(/\$/g, "\\$");
  ret = ret.replace(/\./g, "\\.");
  ret = ret.replace(/\*/g, "\\*");
  ret = ret.replace(/\+/g, "\\+");
  ret = ret.replace(/\|/g, "\\|");
  ret = ret.replace(/\(/g, "\\(");
  ret = ret.replace(/\)/g, "\\)");
  ret = ret.replace(/\[/g, "\\[");
  ret = ret.replace(/\]/g, "\\]");
  ret = ret.replace(/\{/g, "\\{");
  ret = ret.replace(/\}/g, "\\}");
  ret = ret.replace(/\//g, "\\/");
  return ret
};

SearchApi.checkDQ = function(str, pos, flag)
{
  var ret = flag;
  var p = str.indexOf("\"", (pos + 1));
  if (p >= 0)
  {
    ret = SearchApi.checkDQ(str, p, !ret)
  }
  return ret
};

SearchApi.parseQuery = function(query)
{
  var array = query.split(" ");
  var ret = new Array(0);
  var start = 0;
  var flag = false;
  var invert = false;
  var work = "";
  while (start < array.length)
  {
    var str = array[start];
    if (!flag)
    {
      if (str.charAt(0) == "-")
      {
        str = str.slice(1);
        invert = true
      }
      else
      {
        invert = false
      }
    }
    else
    {
      work += " "
    }
    flag = SearchApi.checkDQ(str, -1, flag);
    if (flag)
    {
      work += (str.replace(/"/g, ""))
    }
    else
    {
      work += (str.replace(/"/g, ""));
      ret.push((invert ? "\t" : "") + work);
      work = ""
    }
    start++
  }
  if (work != "")
    ret.push((invert ? "\t" : "") + work);
  return ret
};

SearchApi.highlightText = function(objDocument, node, regex, className)
{
  if (node.nodeType == 3)
  {
    var val = node.nodeValue;
    var re = new RegExp(regex, "i");
    var pos = val.search(re);
    var text = re.exec(val);
    if (pos >= 0 && !($(node.parentNode).hasClass(className)))
    {
      text = text[0];
      var span = objDocument.createElement("span");
      span.className = className;
      span.appendChild(objDocument.createTextNode(val.substr(pos, text.length)));
      var textNode = objDocument.createTextNode(val.substr(pos + text.length));
      node.parentNode.insertBefore(span, node.parentNode.insertBefore(textNode, node.nextSibling));
      node.nodeValue = val.substr(0, pos);
      SearchApi.highlightText(objDocument, textNode, regex, className)
    }
  }
  else
  {
    var name = (node.localName ? node.localName.toLowerCase() : node.nodeName ? node.nodeName.toLowerCase() : "");
    if (name == "img")
    {
      var alt = node.alt;
      if (alt != null)
      {
        var re = new RegExp(regex, "i");
        var pos = alt.search(re);
        if (pos >= 0)
        {
          var work = $(node);
          if (!(work.hasClass(className)))
            work.addClass(className)
        }
      }
    }
    if ((name == "button") || (name == "select") || (name == "textarea"))
      return;
    $(node.childNodes).each(function()
    {
      SearchApi.highlightText(objDocument, this, regex, className)
    })
  }
};

SearchApi.parseHighlight = function()
{
  var q_search = "";
  var query = location.search;
  query = query.slice(query.lastIndexOf("?") + 1);
  var params = query.split("&");
  for (var i = 0; i < params.length; i++)
  {
    var param = params[i];
    var ind = param.indexOf("=");
    if (ind < 0)
      continue;
    var key = param.substring(0, ind);
    key = decodeURIComponent(key);
    key = key.replace(/\s/g, "");
    var data = decodeURIComponent(param.slice(ind + 1));
    if (data == null)
      data = "";
    data = data.replace(/\s/g, "");
    if (key.match(/^highlighttext$/i))
    {
      q_search = param.slice(ind + 1);
      if (q_search == null)
        q_search = "";
      var q_array = q_search.split("+");
      q_search = "";
      for (var n = 0; n < q_array.length; n++)
        q_search += (((n > 0) ? " " : "") + decodeURIComponent(q_array[n]))
    }
  }
  if ((q_search != "") && ((typeof jQuery) == "function"))
  {
    var r_array = SearchApi.parseQuery(q_search);
    var strReg = "";
    for (var x = 0; x < r_array.length; x++)
    {
      if (r_array[x] == "")
        continue;
      if (r_array[x].match(/^ +$/))
        continue;
      if (r_array[x].charAt(0) == "\t")
        continue;
      var str = SearchApi.escapeRegex(r_array[x]);
      if (strReg != "")
        strReg += "|";
      strReg += str
    }
    if (strReg != "")
    {
      $(document).ready(SearchApi.highlightText(document, document.body, strReg, "search_highlight"));
    }
  }
}

SearchApi.setEventHandler = function(eventname, func)
{
  if ((eventname == null) || (eventname == ""))
    return;
  if (func == null)
    return;
  if (window.attachEvent)
    window.attachEvent("on" + eventname, func);
  else if (window.addEventListener)
    window.addEventListener(eventname, func, false)
};

SearchApi.setEventHandler("load", SearchApi.parseHighlight);

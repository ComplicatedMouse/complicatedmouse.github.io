
function GetResultModuleNumber(value)
{
    return (value >> 0) & 0x1FF;
}

function GetResultDescription(value)
{
    return (value >> 9) & 0x1FFF;
}

function GetResultSubDescription(value)
{
    return (value >> 22) & 0x3FF;
}

/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

var g_Modules = g_ResultsInfo.ResultInfos.ResultModules;
var g_Descriptions = g_ResultsInfo.ResultInfos.ErrorResults;
var g_ReferenceInfos = g_ResultsInfo.ReferenceInfos;

function FindModuleInfoByModuleNumber(moduleNumber)
{
    for (var i = 0; i < g_Modules.length; ++i)
    {
        var module = g_Modules[i];
        if (module.Number == moduleNumber)
        {
            return module;
        }
    }
    return null;
}

function FindModuleInfoByModuleName(moduleName)
{
    for (var i = 0; i < g_Modules.length; ++i)
    {
        var module = g_Modules[i];
        if (module.Name == moduleName)
        {
            return module;
        }
    }
    return null;
}

function FindDescriptionInfosByValue(value)
{
    var moduleNumber = GetResultModuleNumber(value);
    var description = GetResultDescription(value);
    var ret = [];
    var n = 0;
    for (var i = 0; i < g_Descriptions.length; ++i)
    {
        var d = g_Descriptions[i];
        if (d.ModuleId == moduleNumber && d.DescriptionBegin <= description && description < d.DescriptionEnd)
        {
            ret[n++] = d;
        }
    }
    ret.sort(function(x, y) { return (x.DescriptionEnd - x.DescriptionBegin) - (y.DescriptionEnd - y.DescriptionBegin); });
    return ret;
}

function FindExactDescriptionInfoByValue(value)
{
    var moduleNumber = GetResultModuleNumber(value);
    var description = GetResultDescription(value);
    var subDescription = GetResultSubDescription(value);
    for (var i = 0; i < g_Descriptions.length; ++i)
    {
        var d = g_Descriptions[i];
        if (d.ModuleId == moduleNumber && d.DescriptionValue == description && subDescription == 0)
        {
            return d;
        }
    }
    return null;
}

function IsPrivate(resultInfo)
{
    return resultInfo && resultInfo.Name == null;
}

function GetFullName(resultInfo)
{
    return resultInfo.Namespace + "::" + resultInfo.Name;
}

function FindReferenceInfo(resultInfo)
{
    var fullName = GetFullName(resultInfo)
    for (var i = 0; i < g_ReferenceInfos.length; ++i)
    {
        var info = g_ReferenceInfos[i];
        if (info.Name == fullName)
        {
            return info;
        }
    }
    return null;
}

function GetResultFullNameHtml(resultInfo)
{
    if (resultInfo == null)
    {
        return "(undefined)";
    }
    if (IsPrivate(resultInfo))
    {
        return "(private)";
    }
    var fullName = GetFullName(resultInfo);
    var info = FindReferenceInfo(resultInfo);
    return info  ? "<a class='el' href='" + info.Path + "'>" + fullName + "</a>" : fullName + " ※";
}

function SetSearchResult(value)
{
    if (value == 0)
    {
        document.getElementById("resultInfo").style.display = "none";
        document.getElementById("parentResultsHolder").style.display = "none";
        document.getElementById("resultMessage").innerHTML = "nn::ResultSuccess";
        document.getElementById("annotation").style.display = "none";
        return;
    }

    var moduleNumber = GetResultModuleNumber(value);
    var description = GetResultDescription(value);
    var moduleInfo = FindModuleInfoByModuleNumber(moduleNumber);
    var descriptionInfo = FindExactDescriptionInfoByValue(value);

    var moduleName = (moduleInfo != null) ? moduleInfo.Name : "(undefined)";
    var descriptionName = GetResultFullNameHtml(descriptionInfo);

    document.getElementById("resultInfo").style.display = "block";
    document.getElementById("resultMessage").innerHTML = descriptionName;
    document.getElementById("resultModule").innerHTML = moduleNumber + " = " + moduleName;
    document.getElementById("resultDescription").innerHTML = description;

    var needsAnnotation = descriptionInfo && !IsPrivate(descriptionInfo) && !FindReferenceInfo(descriptionInfo);

    var parentTable = document.getElementById("parentResults");
    while (parentTable.rows.length > 1)
    {
        parentTable.deleteRow(1);
    }
    var parents = FindDescriptionInfosByValue(value);
    var countPublicParents = 0;
    for (var i = 0; i < parents.length; ++i)
    {
        var parent = parents[i];
        if (IsPrivate(parent))
        {
            continue;
        }
        var row = parentTable.insertRow(countPublicParents + 1);
        var j = 0;
        row.insertCell(j++).innerHTML = GetResultFullNameHtml(parent);
        row.insertCell(j++).innerHTML = parent.ReadableText.length > 0 ? parent.ReadableText[0].Text : "(no text)";
        row.insertCell(j++).innerHTML = FindModuleInfoByModuleName(parent.ModuleName).Number + " = " + parent.ModuleName;
        row.insertCell(j++).innerHTML = parent.IsAbstract ? "(abstract)" : parent.DescriptionValue;
        row.insertCell(j++).innerHTML = "[" + parent.DescriptionBegin + ", " + parent.DescriptionEnd + ")";
        if (!FindReferenceInfo(parent))
        {
            needsAnnotation = true;
        }
        countPublicParents++;
    }
    document.getElementById("parentResultsHolder").style.display = countPublicParents == 0 ? "none" : "block";

    if (needsAnnotation)
    {
        document.getElementById("annotation").style.display = "block";
        document.getElementById("annotationMessage").innerHTML = "※ プログラムでのハンドリングが禁止されている Result です。API 定義は非公開です。";
    }
    else
    {
        document.getElementById("annotation").style.display = "none";
    }
}

function ClearSearchResult()
{
    document.getElementById("resultInfo").style.display = "none";
    document.getElementById("parentResultsHolder").style.display = "none";
    document.getElementById("resultMessage").innerHTML = "(なし)";
    document.getElementById("annotation").style.display = "none";
}

/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

function CallMember(obj, member)
{
    return function()
    {
        return member.apply(obj, arguments);
    };
}

function CallWithParam(func, params)
{
    return function()
    {
        return func.apply(window, params);
    };
}

function RegisterEventHandler(obj, type, listener, handler, useCapture)
{
    if( ! listener.eventHandlerHelpers )
    {
        listener.eventHandlerHelpers = new Array();
    }

    var id = "" + type + handler + useCapture;
    var helper = listener.eventHandlerHelpers[id];

    if( obj.addEventListener )
    {
        if( ! helper )
        {
            helper = new function(obj, cb)
                {
                    this.obj = obj;
                    this.cb = cb;
                    this.handleEvent = function(e)
                    {
                        return this.cb.apply(this.obj, arguments);
                    }
                }(listener, handler);

            listener.eventHandlerHelpers[id] = helper;
        }
        obj.addEventListener(type, helper, useCapture);
    }
    else
    {
        if( ! helper )
        {
            helper = CallMember(listener, handler);
            listener.eventHandlerHelpers[id] = helper;
        }
        obj.attachEvent("on" + type, helper);
    }
}

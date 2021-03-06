(function ($, window, document, undefined) {
    var macro_sql_arr = [];
	  var macro_currentuser_arr = [];
    var w = window;
    var self;
    var MACRO = "macro";
    var FLOW_TYPE_FREE = 1;
    var FIELD_TYPE = {
        "CHECKBOX": "checkbox",
        "TEXT": "text",
        "SELECT": "select",
        "MACRO": "macro",
        "DATE_TIME": "DATE_TIME",
        "DATE": "DATE",
        "TEXTAREA": "textarea",
        "RADIO": "radio",
        "CALCULATOR": "CALCULATOR"
    }
    var MACRO_CODE = {
        MACRO_CURRENT_USER: "macro_current_user",// 当 列表前用户
        MACRO_USER_SELECT: "macro_user_select",// 用户用户列表
        MACRO_USER_MULTI_SELECT_WIN: "macro_user_multi_select_win", // 多用户选择窗体
        MACRO_OPINION: "macro_opinion",
        LOWERTOUPPER: "lowerToUpper",
        MACRO_DEPT_SELECT: "macro_dept_select",
        MACRO_DEPT_SEL_WIN: "macro_dept_sel_win",
        MACRO_USER_SELECT_WIN: "macro_user_select_win",
        MACRO_NEST_SHEET: "nest_sheet",
        MACRO_SIGN: "macro_sign",
        MACRO_SQL: "macro_sql",
        MACRO_LOCATION_CTL: "macro_location_ctl",   // 用于flowInitDetailForm
        MACRO_IMAGE: "macro_image",                 // 图像宏控件，手机端可拍照片
        MACRO_EMAIL: "macro_email_ctl",
        MACRO_MOBILE: "macro_mobile_ctl",
        MACRO_IDCARD: "macro_idcard_ctl",
        MACRO_WRITEPAD: "macro_writepad_ctl"
    }
    var MACRO_TYPE = {
        MACRO_USER_SELECT_TYPE: "userSelect",
        MODULE_FIELD_SELECT: "ModuleFieldSelect",
        MACRO_LOCATION: "location",
        MACRO_USER_MULTI_SEL: "userMultiSelect",
        MACRO_SELECTWIN: "selectWin",   // 部门选择，取自：宏控件.getControlType()
        MACRO_TYPE_IMAGE: "img",         // 图像宏控件 ImageCtl
        MACRO_TYPE_WRITEPAD: "writePad"
    }
    var skey;
    $.Form = $.Class.extend({
        init: function (element, options) {
            this.element = element,
                this.default = {
                    "formSelector": ".mui-input-group",
                    "ulSelector": ".mui-table-view"
                }
            this.options = $.extend(true, this.default, options);
            skey = this.options.skey;
        },
        initForms: function (actionId, flowId, fields, formCode) { // 流程字段content
            var self = this;
            var formSelector = jQuery(self.options.formSelector);
            $.each(fields, function (index, item) {
                var code = item.code;
                var text = item.text;
                var value = item.value;
                var desc = item.desc;
                var type = item.type;
                var macroType = '';
                var isReadonly = false;
                if ("macroType" in item) {
                    macroType = item.macroType;
                }
                var macroCode = '';
                if ("macroCode" in item) {
                    macroCode = item.macroCode;
                }
                var isHidden = item.isHidden;
                if (isHidden == "true") {
                    return;
                }
                var isNull = false;
                var editable = false;
                if ("isNull" in item) {
                    isNull = item.isNull == "true" ? true : false;

                }
                if ("isCanNull" in item) {
                    isNull = item.isCanNull;
                }

                if ("editable" in item) {
                    editable = item.editable == "true" ? true : false;
                }
                if ("isEditable" in item) {
                    editable = item.isEditable;
                }
                if ("isReadonly" in item) {
                    isReadonly = item.isReadonly;
                }
                var divContent = "";
                var row_class = "mui-input-row";
                if (type == FIELD_TYPE.SELECT || macroType == FIELD_TYPE.SELECT) {
                    if (editable && !isReadonly) {
                        row_class = "mui-input-row mui-select";
                    }
                } else if (type == FIELD_TYPE.CHECKBOX) {
                    row_class = "mui-input-row mui-checkbox";
                }
                var title = "<span style='color:#000'>" + item.title + "</span>";
                var _dataIsNull = true;
                if (!isNull && editable) {
                    _dataIsNull = false;
                    title += "<span style='color:red;'>*</span>";
                }
                divContent += '<div class="' + row_class + '" id="row_' + code + '" data-code="' + code + '" data-isNull=' + _dataIsNull + '>';
                divContent += '	<label>' + title + '</label>';
                if (type == FIELD_TYPE.TEXT || macroType == FIELD_TYPE.TEXT) {
                    if (macroCode == MACRO_CODE.MACRO_CURRENT_USER) {// 当前用户
                        divContent += '<input type="hidden" name="' + code + '" id="' + code + '" value="' + value + '"><input type="text" value="' + text + '"  readonly="readonly" />'
            						macro_currentuser_arr.push(item);
                    } else if (macroCode == MACRO_CODE.LOWERTOUPPER) {
                        var readonly = editable ? "" : "readonly";
                        divContent += '	<input type="text" name="' + code + '" id="' + code + '" value="' + value + '" class="mui-input-clear" lowerFieldCode="' +
                            desc + '" title="大小写转换" ' + readonly + ' />'
                    }
                    else if (macroCode = MACRO_CODE.MACRO_IDCARD) {
                        var readonly = editable ? "" : "readonly";
                        divContent += '	<input type="text" name="' + code + '" id="' + code + '" value="' + value + '" class="mui-input-clear" idCardBirthField="' +
                            desc + '" title="身份证" ' + readonly + ' />'
                    }
                    else if (macroCode == MACRO_CODE.MACRO_NEST_SHEET) {
                        var destForm = item.desc.destForm;
                        var sourceForm = item.desc.sourceForm;
                        var parentFields = item.desc.parentFields;
                        var moduleCode = "", pageType = "";
                        var cwsId = "";
                        if ("moduleCode" in self.options) {
                            moduleCode = self.options.moduleCode;
                            if ("id" in self.options) {
                                cwsId = self.options.id;
                                if (cwsId == 0) {
                                    pageType = "add";
                                } else {
                                    pageType = "edit";
                                }
                            }
                        }
                        divContent += '<span class="mui-btn mui-btn-primary nestSheetSelect" parentModuleCode="' + moduleCode + '" cwsId="' + cwsId + '" pageType="' + pageType + '" destForm="' + destForm + '" sourceForm="' + sourceForm + '" flowId=' + flowId + ' actionId=' + actionId + ' code="' + code + '" parentFields="' + parentFields + '" editable="' + editable + '" style="margin: 5px;" >查看</span>';
                    } else if (macroCode == MACRO_CODE.MACRO_SIGN) {
                        var clear_class = editable ? "mui-input-clear" : "";
                        var readonly = "readonly";
                        divContent += '	<input type="text" name="' + code + '" id="' + code + '" value="' + value + '"';
                        divContent += ' class="';
                        if (editable) {
                            divContent += 'signInput ';
                        }
                        divContent += clear_class + '" ' + readonly + ' />';
                    } else if (macroCode == MACRO_CODE.MACRO_SQL) {
                        var clear_class = editable ? "mui-input-clear" : "";
                        var readonly = editable ? "" : "readonly";
                        divContent += '	<input type="text" name="' + code + '" id="' + code + '" value="' + value + '" class="' + clear_class + '" ' + readonly + ' />';
                        macro_sql_arr.push(item);
                    } else {
                        // fieldType 价格型
                        var fieldType = item.fieldType;
                        var clear_class = editable ? "mui-input-clear" : "";
                        var readonly = editable ? "" : "readonly";
                        if (isReadonly) {
                            readonly = "readonly";
                        }
                        if (fieldType == "价格型" && value == "") {
                            divContent += '	<input type="text"  name="' + code + '" id="' + code + '" value="0.00" class="' + clear_class + '" ' + readonly + ' />';
                        } else {
                            divContent += '	<input type="text"  name="' + code + '" id="' + code + '" value="' + value + '" class="' + clear_class + '" ' + readonly + ' />';
                        }
                    }
                    divContent += "</div>";
                } else if (type == FIELD_TYPE.CALCULATOR) {
                    var formula = item.formula;
                    var digit = item.digit;
                    var isroundto5 = item.isroundto5;
                    divContent += '	<input type="text" isroundto5="' + isroundto5 + '" digit="' + digit + '" kind="CALCULATOR"  formula="' + formula + '"  name="' + code + '" id="' + code + '" value="' + value + '" class="' + clear_class + '"/> ';
                } else if (type == FIELD_TYPE.DATE_TIME || type == FIELD_TYPE.DATE) {
                    var options = type == FIELD_TYPE.DATE_TIME ? "{}" : '{"type":"date"}';
                    var icon_class = type == FIELD_TYPE.DATE_TIME ? "iconfont icon-naozhong" : "iconfont icon-rili";
                    var data = value;
                    if (value == "CURRENT") {
                        data = type == FIELD_TYPE.DATE_TIME ? self.formatDateTime(new Date()) : self.formatDate(new Date);
                    }
                    divContent += '	<input type="text" name="' + code + '" id="' + code + '" kind="' + type + '" class="input-icon" value="' + data + '" readonly="readonly" />';
                    if (editable && !isReadonly) {
                        divContent += '<a class="date_btn" data-options=' + options + '><span class="' + icon_class + '"></span> </a>'
                    }
                    divContent += "</div>";
                } else if (type == FIELD_TYPE.SELECT || macroType == FIELD_TYPE.SELECT) {
                    var options = item.options;
                    if (editable && !isReadonly) {
                        divContent += "<select name='" + code + "' id='" + code + "'>"
                        $.each(options, function (s_index, s_item) {
                            var o_text = '';
                            var o_val = '';
                            if ("name" in s_item) {
                                o_text = s_item.name;
                            }
                            if ("value" in s_item) {
                                o_val = s_item.value;
                            }
                            if ("deptCode" in s_item) {
                                o_val = s_item.deptCode;
                            }
                            if ("deptName" in s_item) {
                                o_text = s_item.deptName;
                            }
                            var disabled = editable ? "" : "disabled";
                            var selected = o_val == value ? "selected" : "";
                            divContent += '<option value="' + o_val + '"' + selected + '' + disabled + '>' + o_text + '</option>'
                        })
                        divContent += "</select>"
                    }
                    else {
                        divContent += '<input id="' + code + '_show" type="text" readonly value="' + text + '" class="mui-input-clear"/>';
                        divContent += '<input name="' + code + '" id="' + code + '" type="hidden" value="' + value + '"/>';
                    }
                    divContent += "</div>";
                } else if (type == FIELD_TYPE.CHECKBOX) {
                    var disabled = (editable && !isReadonly) ? "" : "disabled";
                    var checked = "1" == value ? "checked" : "";
                    divContent += '<input name="' + code + '" id="' + code + '" value="' + value + '" type="checkbox" ' + checked + ' ' + disabled + '/>';
                    divContent += "</div>";
                } else if (type == FIELD_TYPE.TEXTAREA || macroType == FIELD_TYPE.TEXTAREA) {
                    var readonly = editable ? "" : "readonly";
                    if (isReadonly) {
                        readonly = "readonly";
                    }
                    if (type == FIELD_TYPE.TEXTAREA) {
                        if (editable == "false" && value == "") {
                            formSelector.append(divContent);
                            return;
                        }
                        divContent += '<div class="div_opinion">';
                        divContent += '	<textarea id="' + code + '" name="' + code + '"  rows="5" placeholder="请输入内容" ' + readonly + '>' + value + '</textarea>'
                        divContent += '</div>';
                        divContent += "</div>";
                    } else {
                        // 意见输入框
                        if (macroCode == MACRO_CODE.MACRO_OPINION) {
                            if (editable) {
                                divContent += '	<textarea id="' + code + '" name="' + code + '"  rows="5" placeholder="请输入审批意见" ></textarea>'
                                divContent += '<div class="opinionContent">';
                                divContent += '<div>';
                                divContent += '<span class="name mui-h6">' + value.opinionRealName + '</span><span class="date mui-h6">' + self.formatDateTime(new Date()) + '</span>	';
                                divContent += '</div>'
                                divContent += '</div>'
                            }
                            $.each(text, function (index, item) {
                                var opinionContent = item.opinionContent;
                                var opinionRealName = item.opinionRealName
                                var opinionTime = item.opinionTime;
                                divContent += '<div class="opinionContent">';
                                divContent += '<h5 class="content_h5">' + opinionContent + '</h5>';
                                divContent += '<div>';
                                divContent += '<span class="name mui-h6">' + opinionRealName + '</span><span class="date mui-h6">' + opinionTime + '</span>	';
                                divContent += '</div>'
                                divContent += '</div>';
                            });
                            divContent += '</div>';
                        }

                    }
                } else if (type == FIELD_TYPE.RADIO) {
                    divContent += "</div>";
                    var options = item.options;
                    var disabled = (editable && !isReadonly) ? "" : "disabled";
                    var mui_class = editable ? "mui-input-row mui-radio" : "mui-input-row mui-radio mui-disabled"
                    $.each(options, function (s_index, s_item) {
                        var o_text = '';
                        var o_val = '';
                        if ("name" in s_item) {
                            o_text = s_item.name;
                        }
                        if ("value" in s_item) {
                            o_val = s_item.value;
                        }
                        var checked = o_val == value ? "checked" : "";
                        divContent += '<div class="' + mui_class + '">'
                        divContent += '<label>' + o_text + '</label><input name="' + code + '" id="' + code + '" type="radio" value="' + o_val + '"   ' + checked + ' ' + disabled + ' />'
                        divContent += '</div>'
                    })
                } else if (macroType == MACRO_TYPE.MACRO_USER_SELECT_TYPE) {
                    if (macroCode == MACRO_CODE.MACRO_USER_SELECT_WIN) {
                        divContent += '<input type="hidden" name="' + code + '" id="' + code + '" value="' + value + '">';
                        divContent += '<input type="text" value="' + text + '" id="' + code + '_realshow" class="input-icon" readonly="readonly" />'
                        if (editable) {
                            divContent += '<span class="mui-btn mui-btn-primary user-select-win" code=\'' + code + '\' style="margin: 5px;" >选择</span>';
                            /**divContent +='<a href="#modal" code="'+code+'" class="userSelect"><span class="iconfont icon-bk-user"></span></a>';**/
                        }
                    } else if (macroCode == MACRO_CODE.MACRO_USER_MULTI_SELECT_WIN) {
                        divContent += '<input type="hidden" name="' + code + '" id="' + code + '" value="' + value + '">';
                        divContent += '<input type="text" value="' + text + '" id="' + code + '_realshow" class="input-icon" readonly="readonly" />'
                        if (editable) {
                            divContent += '<span class="mui-btn mui-btn-primary user-multi-select-win"  code=\'' + code + '\' style="margin: 5px;" >选择</span>';
                            /**divContent +='<a href="#modal" code="'+code+'" class="userSelect"><span class="iconfont icon-bk-user"></span></a>';**/
                        }
                    }
                } else if (macroType == MACRO_TYPE.MACRO_SELECTWIN) {
                    divContent += '<input type="text" id="' + code + '_realshow" value="' + text + '" readonly/>';
                    divContent += '<input type="hidden" name="' + code + '" id="' + code + '" value="' + value + '" />';
                    if (editable) {
                        divContent += '<span class="mui-btn mui-btn-primary dept-select-win"  code=\'' + code + '\' style="margin: 5px;" >选择</span>';
                    }
                } else if (macroType == MACRO_TYPE.MODULE_FIELD_SELECT) {
                    var skey = self.options.skey;
                    var desc = JSON.stringify(item.desc);
                    divContent += '<input type="text" id="' + code + '_realshow" value="' + text + '" readonly/>';
                    divContent += '<input type="hidden" name="' + code + '" id="' + code + '" value="' + value + '" />';
                    if (editable && !isReadonly) {
                        divContent += '<span class="mui-btn mui-btn-primary moduleSelect" desc=\'' + desc + '\' code=\'' + code + '\' style="margin: 5px;" >选择</span>';
                    }
                } else if (macroType == MACRO_TYPE.MACRO_LOCATION) {
                    // console.info(item);
                    divContent += '<input type="text" id="' + code + '_realshow" value="' + text + '" readonly class="input-icon" />';
                    divContent += '<input type="hidden" name="' + code + '" id="' + code + '" value="' + value + '" />';
                    divContent += '<a><span class="mui-icon mui-icon-paperplane icon-location" data-code="' + code + '" data-val = "' + value + '"></span></a>'
                    if (editable) {
                        jQuery(function () {
                            if (value == undefined || value == "") {
                                // 进行浏览器定位
                                var geolocation = new BMap.Geolocation();
                                geolocation.getCurrentPosition(function (r) {
                                    // 定位成功事件
                                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                                        var point = new BMap.Point(r.point.lng, +r.point.lat);
                                        var lat = +r.point.lat;
                                        var lon = r.point.lng;

                                        // 百度地图API功能
                                        var geoc = new BMap.Geocoder();
                                        var point = new BMap.Point(lon, lat);
                                        geoc.getLocation(point, function (rs) {
                                            var addComp = rs.addressComponents;
                                            address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                                            mui.toast("定位成功：" + address);
                                            jQuery('#' + code + '_realshow').val(address);
                                            jQuery('#' + code).val(lon + "," + lat + "," + address);
                                        });
                                    }
                                }, {enableHighAccuracy: true})
                            }
                        });
                    }
                } else if (macroType==MACRO_TYPE.MACRO_TYPE_IMAGE) {
                    divContent += '<input id="' + code + '" name="' + code + '" type="hidden" value="' + value + '"/>';
                    // 如果不含有小数点，说明不是文件名，而是默认值，如200,200，表示限定的宽高值
                    if (value!="" && value.indexOf(".")!=-1) {
                        var ext = value.substring(value.lastIndexOf(".") + 1).toLowerCase();
                        divContent += "<img class='attFile' link='../../public/img_show.jsp?path=" + value + "' ext='" + ext + "' src='../../public/img_show.jsp?path=" + value + "' style='width:96%' />";
                    }
                    var isOnlyCamera = false;
                    if (desc.indexOf('{')==0) {
                        var descJson = $.parseJSON(desc);
                        isOnlyCamera = descJson.isOnlyCamera;
                    }
                    if (editable && !isReadonly) {
                        divContent += '<span class="mui-btn mui-btn-primary capture_btn" captureFieldName="' + code + '" isOnlyCamera="' + isOnlyCamera + '" style="margin: 5px;" >照片</span>';
                    }
                }
                else if (macroType==MACRO_TYPE.MACRO_TYPE_WRITEPAD) {
                    divContent += '<input id="' + code + '" name="' + code + '" type="hidden" value="' + value + '"/>';
                    divContent += '<div id="pad_' + code + '">';
                    if (value!="") {
                        var ext = value.substring(value.lastIndexOf(".") + 1).toLowerCase();
                        divContent += "<img id='" + code + "_img' class='attFile' link='../../public/img_show.jsp?path=" + value + "' ext='" + ext + "' src='../../public/img_show.jsp?path=" + value + "' />";
                    }
                    divContent += "</div>";
                    if (editable && !isReadonly) {
                        divContent += '<span class="mui-btn mui-btn-primary sign_btn" data-code="' + code + '" style="margin: 5px;" >签名</span>';
                    }
                }

                formSelector.append(divContent);
            });
            self.bindEvent();
            if (macro_sql_arr.length > 0) {
                macroSqlInit(flowId, skey, macro_sql_arr, formCode);
            }
            if (macro_currentuser_arr.length>0) {
                macroCurrentUserInit(flowId, skey, macro_currentuser_arr, formCode);
            }
        },
        initAtStep: function (annex) {
            var ul = '<ul class="at_flow">'
            var li = '';
            $.each(annex, function (index, item) {
                var readDate = item.readDate;
                var result = item.result;
                var userName = item.userName;
                var defaut_avatar = item.gender == 0 ? '../images/avatar_male.png' : '../images/avatar_female.png';
                var photo = item.photo == '' ? defaut_avatar : '../../' + item.photo;
                li += '<li class="clearfix">'
                li += '<span class="time">' + readDate + '</span>';
                li += '<div class="contain" >';
                li += '<div>';
                li += '<div class="avaterDiv">';
                li += '<img src="' + photo + '" width="48" height="48" />';
                li += '</div>';
                li += ' <span class="userName">' + userName + '</span>';
                li += ' <span class="comment" />';
                li += '</div>';
                li += '<div class="content">' + result + '</div>'
                var annexs = item.annexs;
                if (annexs.length > 0) {
                    li += '<div class="reply_content">';
                    $.each(annexs, function (iIndex, iItem) {
                        var annexUser = iItem.annexUser;
                        var content = iItem.content;
                        var add_date = iItem.add_date;
                        li += '<div class="item_reply">';
                        li += '<span class="reply_name">' + annexUser + '</span>';
                        li += '<span class="reply_date text-right">' + add_date + '</span>'
                        li += '<div class="re_content">'
                        li += '<span>' + content + '</span>'
                        li += '</div>';
                        li += '</div>'
                    });
                    li += '</div>'
                }
                li += '</div>';
                li += '</li>'
            });
            ul += li;
            ul += '</ul>';
            return ul;
        },
        initItemCommonLi: function (title, value, code) {
            var li = '';
            if (code != null) {
                li += ' <li class="mui-table-view-cell" id="row_' + code + '">';
            } else {
                li += ' <li class="mui-table-view-cell">';
            }
            li += ' <div class="mui-table">';
            li += ' <div class="mui-table-cell mui-col-xs-5">';
            li += ' <span class="mui-h5">' + title + '</span>';
            li += ' </div>'
            li += ' <div class="mui-table-cell mui-col-xs-5">';
            li += ' <span class="mui-h5">' + value + '</span>'
            li += ' </div>'
            li += ' </div>';
            li += '</li>';
            return li
        },
        initFlowDetail: function (data) {
            var self = this;
            var ul = jQuery(self.options.ulSelector);
            var fields = data.result.fields;
            var flowTypeName = data.flowTypeName;
            var status = data.status;
            var createDate = data.createDate;
            var sender = data.sender;
            ul.append(self.initItemCommonLi("流程名称", flowTypeName));
            ul.append(self.initItemCommonLi("发起人", sender));
            ul.append(self.initItemCommonLi("创建日期", createDate));
            ul.append(self.initItemCommonLi("状态", status));
            self.flowInitDetailForm(fields); //加载流程表单

            if ("files" in data.result) {
                var _files = data.result.files;
                if (_files.length > 0) {
                    var isShowPage = true;
                    jQuery(".annex-group").before(self.flowInitFiles(_files, isShowPage));
                }
            }
            jQuery(".mui-content").on("tap", ".attFile", function () {
                var url = jQuery(this).attr("link");
                var ext = jQuery(this).attr("ext");
                if (ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "gif" || ext == "bmp") {
                    var w=0, h=0;
                    if (this.tagName=="IMG") { // 图像宏控件
                        w = jQuery(this).width();
                        h = jQuery(this).height();
                    }
                    // self.showImg(url, w, h); // photoswipe显示不出图片，原因不明，故弃用
                    mui.openWindow({
                        "url": url
                    })
                } else {
                    mui.openWindow({
                        "url": url
                    })
                }
                return false;
            });
            $(".mui-content").on('tap', '.att_download', function (event) {
                var elem = this;
                var li = elem.parentNode.parentNode;
                var url = jQuery(li).find('.attFile').attr('link');
                mui.openWindow({
                    "url": url
                })
            });

            if (data.viewJs) {
                ul.append('<div id="viewJsBox" class="mui-input-row" style="display:none"></div>');
                jQuery('#viewJsBox').html(data.viewJs);
                // console.log(data.viewJs);
            }

            if ("isProgress" in data) {
                if (data.isProgress) {
                    var annexGroup = '<ul class="mui-table-view reply-ul">';
                    var annexes = data.result.annexs;
                    $.each(annexes, function (index, item) {
                        annexGroup += '<li class="mui-table-view-cell">';
                        annexGroup += '	<div class="reply-header">';
                        annexGroup += '		<span class="reply-name">' + item.annexUser + '</span><span class="reply-progress">' + item.progress + '%</span>';
                        annexGroup += '		<span class="reply-date">' + item.add_date + '</span>';
                        annexGroup += '	</div>';
                        annexGroup += '	<div class="reply-content">' + item.content + '</div>';
                        annexGroup += '</li>';
                    });
                    annexGroup += "</ul>";
                    jQuery('.reply-form').show();
                    jQuery('#progressLabel').text(data.progress);
                    jQuery('#progress').val(data.progress);
                    jQuery(".annex-group").append(annexGroup);
                }
            }

            var isLight = data.isLight;// 是不是@流程
            if (isLight) {
                jQuery(".mui-content").append(self.initAtStep(data.lightDetail));
            }
        },
        flowInitDetailForm: function (fields) {
            var self = this;
            var skey = self.options.skey;
            var ul = jQuery(self.options.ulSelector);
            $.each(fields, function (index, item) {
                var li = '';
                var title = item.title;
                var type = item.type;
                var value = item.value;
                var type = item.type;
                var macroCode = item.macroCode;
                var code = item.code;
                if (macroCode == MACRO_CODE.MACRO_NEST_SHEET) {
                    //	console.info(item);
                    var divContent = '';
                    var destForm = item.desc.destForm;
                    var sourceForm = item.desc.sourceForm;
                    var parentFields = item.desc.parentFields;
                    var flowId = 0;
                    var moduleCode = "";
                    var cwsId = 0;
                    var pageType = "flow";
                    if ("flowId" in self.options) {
                        flowId = self.options.flowId;
                    }
                    if ("moduleCode" in self.options) {
                        moduleCode = self.options.moduleCode;
                        pageType = "show";
                    }
                    if ("id" in self.options) {
                        cwsId = self.options.id;
                    }

                    divContent = '<span class="mui-btn mui-btn-primary nestSheetSelect" parentModuleCode="' + moduleCode + '" cwsId= "' + cwsId + '"  pageType="' + pageType + '" destForm="' + destForm + '" sourceForm="' + sourceForm + '" flowId=' + flowId + ' actionId=0  code="' + item.code + '" parentFields="' + parentFields + '" editable="false" style="margin: 5px;" >查看</span>';
                    li += ' <li class="mui-table-view-cell" id="row_' + code + '">';
                    li += ' <div class="mui-table">';
                    li += ' <div class="mui-table-cell mui-col-xs-5">';
                    li += '<span class="mui-h5">' + title + '</span>';
                    li += '</div>'
                    li += ' <div class="mui-table-cell mui-col-xs-5">';
                    li += divContent;
                    li += '</div>'
                    li += ' </div>';
                    li += '</li>';
                } else if (macroCode == MACRO_CODE.MACRO_OPINION) {
                    var divContent = '';
                    $.each(value, function (index2, item2) {
                        var opinionContent = item2.opinionContent;
                        var opinionRealName = item2.opinionRealName
                        var opinionTime = item2.opinionTime;
                        divContent += '<div class="opinionContent">';
                        divContent += '<h5 class="content_h5">' + opinionContent + '</h5>';
                        divContent += '<div>';
                        divContent += '<span class="name mui-h6">' + opinionRealName + '</span><span class="date mui-h6">' + opinionTime + '</span>	';
                        divContent += '</div>'
                        divContent += '</div>';
                    });
                    li += ' <li class="mui-table-view-cell" id="row_' + code + '">';
                    li += ' <div class="mui-table">';
                    li += ' <div class="mui-table-cell mui-col-xs-5">';
                    li += ' <span class="mui-h5">' + title + '</span>';
                    li += ' </div>'
                    li += ' <div class="mui-table-cell mui-col-xs-5">';
                    li += divContent;
                    li += ' </div>'
                    li += ' </div>';
                    li += '</li>';
                } else if (macroCode == MACRO_CODE.MACRO_LOCATION_CTL) {
                    var _arr = new Array(); // 定义一数组
                    _arr = value.split(","); // 字符分割
                    var _text = "";
                    if (_arr.length == 3) {
                        _text = _arr[2];
                    }

                    li += ' <li class="mui-table-view-cell" id="row_' + code + '">';
                    li += ' <div class="mui-table">';
                    li += ' <div class="mui-table-cell mui-col-xs-5">';
                    li += ' <span class="mui-h5">' + title + '</span>';
                    li += ' </div>'
                    li += ' <div class="mui-table-cell mui-col-xs-5">';
                    li += ' <span class="mui-h5">' + _text + '</span>'
                    li += ' <a><span class="mui-icon mui-icon-paperplane icon-location" data-code="' + code + '" data-val = "' + value + '"></span></a>'
                    li += ' </div>'
                    li += ' </div>';
                    li += '</li>';
                } else if (macroCode == MACRO_CODE.MACRO_IMAGE) {
                    li += ' <li class="mui-table-view-cell" id="row_' + code + '">';
                    li += ' <div class="mui-table">';
                    li += ' <div class="mui-table-cell mui-col-xs-5">';
                    li += ' <span class="mui-h5">' + title + '</span>';
                    li += ' </div>'
                    li += ' <div class="mui-table-cell mui-col-xs-5">';
                    var ext = value.substring(value.lastIndexOf(".") + 1).toLowerCase();
                    li += '     <img class="attFile" link="../../public/img_show.jsp?path=' + value + '" ext="' + ext + '" style="width:96%" src="../../public/img_show.jsp?path=' + value + '"/>';
                    li += ' </div>'
                    li += ' </div>';
                    li += '</li>';
                } else if (macroCode == MACRO_CODE.MACRO_WRITEPAD) {
                    li += ' <li class="mui-table-view-cell" id="row_' + code + '">';
                    li += ' <div class="mui-table">';
                    li += ' <div class="mui-table-cell mui-col-xs-5">';
                    li += ' <span class="mui-h5">' + title + '</span>';
                    li += ' </div>'
                    li += ' <div class="mui-table-cell mui-col-xs-5">';
                    var ext = value.substring(value.lastIndexOf(".") + 1).toLowerCase();
                    li += '     <img class="attFile" link="../../public/img_show.jsp?path=' + value + '" ext="' + ext + '" style="width:96%" src="../../public/img_show.jsp?path=' + value + '"/>';
                    li += ' </div>'
                    li += ' </div>';
                    li += '</li>';
                } else if (macroCode == MACRO_CODE.MACRO_EMAIL) {
                    li += ' <li class="mui-table-view-cell" id="row_' + code + '">';
                    li += ' <div class="mui-table">';
                    li += ' <div class="mui-table-cell mui-col-xs-5">';
                    li += ' <span class="mui-h5">' + title + '</span>';
                    li += ' </div>'
                    li += ' <div class="mui-table-cell mui-col-xs-5">';
                    li += '     ' + value;
                    li += ' </div>'
                    // li += ' <div class="mui-table-cell mui-col-xs-2"><a href="mailto:' + value + '" class="mui-icon mui-icon-email mui-pull-right" style="font-size:25px"></a></div>'
                    li += ' </div>';
                    li += '</li>';
                }
                else if (macroCode == MACRO_CODE.MACRO_MOBILE) {
                    li += ' <li class="mui-table-view-cell" id="row_' + code + '">';
                    li += ' <div class="mui-table">';
                    li += ' <div class="mui-table-cell mui-col-xs-5">';
                    li += ' <span class="mui-h5">' + title + '</span>';
                    li += ' </div>'
                    li += ' <div class="mui-table-cell mui-col-xs-3">';
                    li += '     ' + value;
                    li += ' </div>'
                    li += ' <div class="mui-table-cell mui-col-xs-2"><a href="tel:' + value + '" class="mui-icon mui-icon-phone mui-pull-right" style="font-size:25px"></a></div>'
                    li += ' </div>';
                    li += '</li>';
                }
                else {
                    li = self.initItemCommonLi(title, value, code);
                }

                ul.append(li);
            });

            $(".mui-table-view-cell").on("tap", ".icon-location", function () {
                openBaiduMap(this);
            });
            $(".mui-table-view-cell").on("tap", ".nestSheetSelect", function () {
                openNestSheet(this, skey);
            });
        },
        flowInitFiles: function (files, isShowPage) {
            var self = this;
            var _ul = '<ul class="mui-table-view mui-table-view-chevron att_ul" >'
            _ul += '<li class="mui-table-view-cell mui-media ">附件列表：</li>';
            $.each(files, function (index, item) {
                var _id = -1;
                var canDel = false;
                var isFlow = false;
                // 如果是流程中，则含有canDel，如果是模块中，则不含有
                if ("canDel" in item) {
                    canDel = item.canDel;
                    isFlow = true;
                    if ("id" in item) {
                        _id = item.id;
                    }
                } else {
                    _id = item.id;
                    canDel = true;
                }
                // 如果是显示页，如flow_modify.jsp
                if (isShowPage) {
                    canDel = false;
                }
                var _name = item.name;
                var _size = item.size;
                var ext = _name.substring(_name.lastIndexOf(".") + 1).toLowerCase();
                var _imgUrl = self.getFileImg(ext);
                var _url = item.url + "&skey=" + self.options.skey;

                _ul += '<li class="mui-table-view-cell mui-media att_li" fId="' + _id + '">';
                _ul += '<div class="mui-slider-right mui-disabled">';
                if (canDel) {
                    _ul += '<a class="mui-btn mui-btn-red att_del" isFlow="' + isFlow + '">删除</a>';
                }
                _ul += '<a class="mui-btn mui-btn-yellow att_download">下载</a>';
                _ul += '</div>';
                _ul += '<div class="mui-slider-handle">';
                _ul += '<a class="attFile" ext="' + ext + '" href="javascript:;" link="../../' + _url + '" target="_blank" >';
                _ul += '<img class="mui-media-object mui-pull-left" src="../images/file/' + _imgUrl + '" />';
                _ul += '	<div class="mui-media-body">';
                _ul += _name;
                _ul += '</div>';
                _ul += '</a>';
                _ul += '</div>';
                _ul += '</li>';
            });
            _ul += '</ul>';
            return _ul;

        },
        bindFileDel: function () {
            var self = this;
            var skey = self.options.skey;
            $(".mui-content").on('tap', '.att_del', function (event) {
                var elem = this;
                var li = elem.parentNode.parentNode;
                var fId = li.getAttribute("fId");//判断是否是新增
                var btnArray = ['确认', '取消'];
                var isFlow = jQuery(this).attr("isFlow");

                /*	if(fId != "0"){
                        $.toast("无法删除!");
                        setTimeout(function() {
                         $.swipeoutClose(li);
                     }, 0);
                        return;
                    }*/
                mui.confirm('确认删除该条记录？', '提示', btnArray, function (e) {
                    setTimeout(function () {
                        $.swipeoutClose(li);
                    }, 0);
                    if (e.index == 0) {
                        if (fId != "0") {
                            // console.log("isFlow=" + isFlow);
                            mui.get("../../public/android/module/attDel",
                                {"skey": skey, "id": fId, "flow": isFlow}, function (data) {
                                    var res = data.res;
                                    var msg = data.msg;
                                    if (res == "0") {
                                        $.toast("删除成功!");
                                        li.parentNode.removeChild(li);
                                        var _pLen = jQuery(".att_li").length;
                                        if (_pLen == 0) {
                                            jQuery(".att_ul").remove();
                                        }

                                    } else {
                                        $.toast(msg);
                                    }

                                }, "json");

                        } else {
                            li.parentNode.removeChild(li);
                            var _index = jQuery(li).index() - 1;
                            blob_arr.splice(_index, 1);
                            var _pLen = jQuery(".att_li").length;
                            if (_pLen == 0) {
                                jQuery(".att_ul").remove();
                            }
                        }

                    }
                });
            });

            $(".mui-content").on('tap', '.att_download', function (event) {
                var elem = this;
                var li = elem.parentNode.parentNode;
                var url = jQuery(li).find('.attFile').attr('link');
                mui.openWindow({
                    "url": url
                })
            });
        },
        formatDateTime: function (date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            var second = date.getSeconds();
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
        },
        formatDate: function (date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            return y + '-' + m + '-' + d;
        },

        bindEvent: function () {
            var self = this;
            var content = self.element;
            var formSelector = self.options.formSelector;
            var skey = self.options.skey;
            // 日期选择控件
            $(formSelector).on("tap", ".date_btn", function () {
                var optionsJson = this.getAttribute('data-options') || '{}';
                var options = JSON.parse(optionsJson);
                var id = this.getAttribute('id');
                var par = this.parentNode;
                var time_input = par.querySelector(".input-icon");
                var picker = new $.DtPicker(options);
                picker.show(function (rs) {
                    if (options.type == "date") {
                        jQuery(time_input).val(rs.value);
                    } else {
                        jQuery(time_input).val(rs.value + ":00");
                    }
                    picker.dispose();
                });
            });
            // 签名框
            var isIos = false;
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                isIos = true;
            } else if (/(Android)/i.test(navigator.userAgent)) {
            } else {
            }
            ;

            // ios上面会先置入插入点，再点一次才能弹出
            $(formSelector).on("tap", ".signInput", function () {
                openSignIn(this, skey);
            });

            // 表单域选择
            $(formSelector).on("tap", ".moduleSelect", function () {
                openModuleField(this, skey);
            });
            $(formSelector).on("tap", ".dept-select-win", function () {
                openDeptWin(this);
            });

            $(formSelector).on("tap", ".user-select-win", function () {
                //处理
                selectUserWin(this, false);
            });
            $(formSelector).on("tap", ".user-multi-select-win", function () {
                //处理
                selectUserWin(this, true);
            });

            // 嵌套表按钮
            $(formSelector).on("tap", ".nestSheetSelect", function () {
                openNestSheet(this, skey);
            });
            $(formSelector).on("tap", ".attFile", function () {
                var url = jQuery(this).attr("link");
                var ext = jQuery(this).attr("ext");
                if (ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "gif" || ext == "bmp") {
                    var w=0, h=0;
                    if (this.tagName=="IMG") { // 图像宏控件
                        w = jQuery(this).width();
                        h = jQuery(this).height();
                    }
                    self.showImg(url, w, h);
                } else {
                    mui.openWindow({
                        "url": url
                    })
                }
            });
            $(formSelector).on("tap", ".icon-location", function () {
                openBaiduMap(this);
            });

            $(formSelector).on("tap", ".sign_btn", function() {
                openWritePadWin(this);
            });

            lowerToUpper();// 大小写金额转换
            initCalculator();// 计算控件初始化
            onIdCardChange(); // 绑定身份证变化事件
        },
        showImg: function (path, width, height) {
            var w = 964, h = 1024;
            if (width && height) {
                w = width;
                h = height;
            }
            var openPhotoSwipe = function () {
                var pswpElement = jQuery('.pswp')[0];
                var items = [{
                    // src格式为../../public/img_show.jsp?path="+encodeURI(path),
                    src: path,
                    w: w,
                    h: h
                }
                ];
                // define options (if needed)
                var options = {
                    // history & focus options are disabled on CodePen
                    history: false,
                    focus: false,
                    tapToClose: false,
                    showAnimationDuration: 0,
                    hideAnimationDuration: 0
                };
                var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
                gallery.init();
            };
            openPhotoSwipe();
        },
        getFileImg: function (ext) {
            var _fname = "";
            if ("jpe,jpeg,gif,bmp,jpg,png".indexOf(ext) != -1) {
                _fname = "png.png";
            } else if ("doc,docx,wps".indexOf(ext) != -1) {
                _fname = "word.png";
            } else if ("xls,xlsx".indexOf(ext) != -1) {
                _fname = "excel.png";
            } else if ("pdf".indexOf(ext) != -1) {
                _fname = "pdf.png";
            } else if ("ppt,pptx".indexOf(ext) != -1) {
                _fname = "ppt.png";
            } else if ("txt".indexOf(ext) != -1) {
                _fname = "txt.png";
            } else if ("avi,mov,asf,wmv,3gp,mp4,rmvb,flv".indexOf(ext) != -1) {
                _fname = "mp4.png";
            } else if ("mp3,wma".indexOf(ext) != -1) {
                _fname = "mp3.png";
            } else if ("zip,rar".indexOf(ext) != -1) {
                _fname = "zip.png";
            } else {
                _fname = "other.png";
            }
            return _fname;
        }

    });
})(mui, document, window)

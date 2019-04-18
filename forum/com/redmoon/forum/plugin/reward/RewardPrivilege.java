package com.redmoon.forum.plugin.reward;

import javax.servlet.http.HttpServletRequest;
import cn.js.fan.util.ErrMsgException;
import com.redmoon.forum.plugin.base.IPluginPrivilege;
import com.redmoon.forum.Privilege;
import org.apache.log4j.Logger;
import com.redmoon.forum.MsgDb;
import com.redmoon.kit.util.FileUpload;

public class RewardPrivilege implements IPluginPrivilege {
    static Logger logger = Logger.getLogger(RewardPrivilege.class.getName());

    public RewardPrivilege() {
    }

    public boolean canAddNew(HttpServletRequest request, String boardCode, FileUpload fu) throws ErrMsgException {
        // 检测本版是否含有此功能
        RewardUnit iu = new RewardUnit();
        if(!iu.isPluginBoard(boardCode))
            throw new ErrMsgException(RewardSkin.LoadString(request, "addNewErrorBoardInvalid"));
        return true;
    }

    public boolean isOwner(HttpServletRequest request, long msgRootId) {
        MsgDb md = new MsgDb();
        md = md.getMsgDb(msgRootId);
        Privilege privilege = new Privilege();
        String user = privilege.getUser(request);
        if (user.equals(md.getName()))
            return true;
        else
            return false;
    }

    public boolean canAddReply(HttpServletRequest request, String boardCode, long msgRootId) throws ErrMsgException {
        // 检测本版是否含有此功能
        RewardUnit iu = new RewardUnit();
        if(!iu.isPluginBoard(boardCode))
            throw new ErrMsgException(RewardSkin.LoadString(request, "addNewErrorBoardInvalid"));

        return true;
    }

    public boolean canEdit(HttpServletRequest request, MsgDb md) throws ErrMsgException {
        // 检测本版是否含有此功能
        RewardUnit iu = new RewardUnit();
        if(!iu.isPluginBoard(md.getboardcode()))
            throw new ErrMsgException(RewardSkin.LoadString(request, "addNewErrorBoardInvalid"));

        Privilege privilege = new Privilege();
        String user = privilege.getUser(request);

        boolean re = false;
        // 如果贴子作者是本人则可以编辑
        if (user.equals(md.getName()))
            re = true;
        else { // 如果是版主

        }

        return re;
    }

    /**
     *
     * @param request HttpServletRequest
     * @param md MsgDb replyid所对应的贴子，也即根贴
     * @return boolean
     * @throws ErrMsgException
     */
    public boolean canAddQuickReply(HttpServletRequest request, MsgDb md) throws
            ErrMsgException {
        return true;
    }

    public boolean canManage(HttpServletRequest request, long msgId) throws ErrMsgException {
        MsgDb md = new MsgDb();
        md = md.getMsgDb(msgId);

        // 检测本版是否含有此功能
        RewardUnit iu = new RewardUnit();
        if(!iu.isPluginBoard(md.getboardcode()))
            throw new ErrMsgException(RewardSkin.LoadString(request, "addNewErrorBoardInvalid"));

        Privilege privilege = new Privilege();
        // String user = privilege.getUser(request);

        boolean re = false;
        /*
        // 如果是楼主可以管理
        long rootId = md.getRootid();
        md = md.getMsgDb(rootId);
        if (user.equals(md.getName()))
            re = true;
        */

        // 如果是版主则可以管理
        if (privilege.canManage(request, msgId)) {
            re = true;
        }

        return re;
    }
}
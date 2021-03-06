package org.ramer.diary.util;

import lombok.extern.slf4j.Slf4j;
import org.ramer.diary.constant.MessageConstant;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.http.HttpSession;

/**
 * 用户工具类，包含常用的静态方法：
 * <strong>
 *  1.登陆检测
 *  2.操作成功返回
 *  </strong>
 * @author ramer
 *
 */
@Slf4j
public class UserUtils{
    //默认成功信息
    private static final String SUCCESS_MESSAGE = MessageConstant.SUCCESS_MESSAGE;

    /**
     * 操作成功.
     *
     * @param session the session
     * @param succMessage 成功信息
     */
    public static void execSuccess(HttpSession session, String... succMessage) {
        if (succMessage.length > 0) {
            session.setAttribute("succMessage", succMessage[0]);
            return;
        }
        session.setAttribute("succMessage", SUCCESS_MESSAGE);
    }

    /**
     * 检测用户是否登录.
     *
     * @return 已登录返回true,否则返回false
     */
    public static boolean checkLogin() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.debug(Thread.currentThread().getStackTrace()[1].getMethodName() + " principal : {}", principal);
        if (principal.equals("anonymousUser")) {
            return false;
        }
        org.springframework.security.core.userdetails.User user = (org.springframework.security.core.userdetails.User) principal;
        log.info(Thread.currentThread().getStackTrace()[1].getMethodName() + "  login user: [{}]", user.getUsername());
        return true;
    }
}

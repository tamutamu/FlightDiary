<%@ page language="java" contentType="text/html; charset=utf-8"
		pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" type="text/css"
		href="${pageContext.request.contextPath}/css/success.css">
<link rel="stylesheet" type="text/css"
		href="${pageContext.request.contextPath}/css/default.css">
<title>操作成功</title>
</head>
<body>
		<div class="return_link">
				<a href="${pageContext.request.contextPath}/home">返回主页</a><br>
		</div>
		<div class="succMessage">${succMessage}</div>
</body>
</html>
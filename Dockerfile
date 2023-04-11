# 使用 Nginx 作为 web 服务器来提供已构建的 Vue 应用程序
FROM nginx
COPY ./dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf  

COPY  ./default.conf /etc/nginx/conf.d/default.conf 
CMD ["nginx", "-g", "daemon off;"]
 
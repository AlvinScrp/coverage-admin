## Build Setup

```bash
# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9528

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

# docker
> https://nodejs.org/zh-cn/docs/guides/nodejs-docker-webapp
## 构建镜像
docker build . -t coverage-admin:v0.0.3
docker buildx build --platform linux/amd64 . -t coverage-admin:v0.0.3
## 运行容器

docker run -d -p 9001:9001  coverage-admin:v0.0.3
>在 Docker 容器中挂载宿主机上的文件，需要正确配置挂载选项才能启用 birthtime 属性。具体而言，在 Linux 和 macOS 系统中，可以使用以下选项来挂载文件并启用 birthtime 属性：
macOS
对于 macOS 的 HFS+ 和 APFS 文件系统，需要添加 bsdflags 和 noappledouble 选项：
docker run -v /path/on/host:/path/in/container:ro,bsdflags=0x100000,noappledouble myimage


## Get container ID
$ docker ps

## Print app output
$ docker logs <container id>

##  Example
Running on http://localhost:8080


##  Kill our running container
$ docker kill <container id>
<container id>
## Confirm that the app has stopped
$ curl -i localhost:49160
curl: (7) Failed to connect to localhost port 49160: Connection refused

## docker进入工作目录
docker exec -ti ec4d11930e1a13e46c2dfe7effb1b72c21f90840f2735047092e64b1fa3a5c08 /bin/bash



## image hub push
docker tag coverage-admin:v0.0.3 alvinscrp/coverage-admin:v0.0.3
docker push alvinscrp/coverage-admin:v0.0.3

## image hub pull
docker pull alvinscrp/coverage-admin:v0.0.3
docker run -p 9001:9001 -d alvinscrp/coverage-admin 
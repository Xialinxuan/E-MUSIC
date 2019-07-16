# E-MUSIC

### 2019-7-16

+ 初步整合前后端，目前后端实现从自建API获取并处理歌词，能够调用NLU服务以及能够通过关键词搜索获得歌曲信息
+ 重新进行文件架构，使其适配IBM cloud环境，并进行去隐私化处理，请自行修改/controllers/service-example.js文件以使用
+ 启动前需执行npm install以安装包
+ 启动方式由原来的npm start改为**node app.js**，退出方式仍可使用ctrl+C
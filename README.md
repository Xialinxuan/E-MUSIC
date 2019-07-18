

# E-MUSIC

### 2019-7-18

- 添加对数据库操作，启动前修改/models/config-example.js文件为config.js，具体内容应该不需要修改，因为暂时无需使用数据库
- 启动前需执行npm install以安装包
- 修改了package.json的内容，现在喜欢使用npm start的同学可以用这种方式启动了，node app.js仍然支持
- 添加了更多查询歌曲信息的操作
- 更换了API的URL接口，因为老的URL被封杀了
- 添加了更多对数据库的操作
- 后端功能基本完善
- 前后端开始交互

### 2019-7-16

+ 初步整合前后端，目前后端实现从自建API获取并处理歌词，能够调用NLU服务以及能够通过关键词搜索获得歌曲信息
+ 重新进行文件架构，使其适配IBM cloud环境，并进行去隐私化处理，请自行修改/controllers/service-example.js文件以使用
+ 启动前需执行npm install以安装包
+ 启动方式由原来的npm start改为**node app.js**，退出方式仍可使用ctrl+C
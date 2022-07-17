# Pancake重置

pancake的重制版。将功能改为模块加载，方便修改。

为什么不试着做一个属于自己的PS呢？(笑)

仅仅是个框架，需要功能请自增或等待佛系更新。

1.将packetIds.json和initalKey.bin放置于./data/util目录下

2.将proto置于./data/proto目录下

3.根据提示自行在./server/handle目录下增加模块，根据模块模板添加

4.正式服2.8版本校验方式有所改变，需要打上单独的补丁。我的解决方案是每个服务器对应单独的补丁，且经测试使用正确的protos后本项目仍能正常工作。

5.请自行抓包并解析cur内容将其补充到query_cur_region.js

更新：若node-kcp或ffi-napi安装失败，可以尝试直接解压压缩包到node_modules，此包仅适用于nodejs v16.14.2

注意：仅仅是将PC模块化！！！务必注意！！！

另：请单独安装node-rsa模块。

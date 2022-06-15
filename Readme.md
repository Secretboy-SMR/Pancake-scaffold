# Pancake重置

pancake的重制版。将功能改为模块加载，方便修改。

为什么不试着做一个属于自己的PS呢？(笑)

仅仅是个框架，需要功能请自增或等待佛系更新。

1.将packetIds.json和initalKey.bin放置于./data/util目录下(2.7.5的已经提供)

2.将proto置于./data/proto目录下(2.7.5的已经提供)

3.根据提示自行在./server/handle目录下增加模块，根据模块模板添加(2.7.5的已经提供部分)

4.运行./rd_px/proxy_ys，打开游戏

5.此版本脚手架适用于2.7.5国服测试服制作

更新：若node-kcp或ffi-napi安装失败，可以尝试直接解压压缩包到node_modules，此包仅适用于nodejs v16.14.2

注意：仅仅是将PC模块化！！！务必注意！！！

另：rd_px并不适用于某GC机器。

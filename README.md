
> 注：当前项目为 Serverless Devs 应用，由于应用中会存在需要初始化才可运行的变量（例如应用部署地区、函数名等等），所以**不推荐**直接 Clone 本仓库到本地进行部署或直接复制 s.yaml 使用，**强烈推荐**通过 `s init ${模版名称}` 的方法或应用中心进行初始化，详情可参考[部署 & 体验](#部署--体验) 。

# fc-bge-collection 帮助文档
<p align="center" class="flex justify-center">
    <a href="https://www.serverless-devs.com" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-bge-collection&type=packageType">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=fc-bge-collection" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-bge-collection&type=packageVersion">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=fc-bge-collection" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-bge-collection&type=packageDownload">
  </a>
</p>

<description>

使用serverless devs将  开源bge-m3, bge-reranker, bge-large-zh-1.5 等模型合并部署

</description>

<codeUrl>



</codeUrl>
<preview>



</preview>


## 前期准备

使用该项目，您需要有开通以下服务并拥有对应权限：

<service>



| 服务/业务 |  权限  | 相关文档 |
| --- |  --- | --- |
| 函数计算 |  创建函数 | [帮助文档](https://help.aliyun.com/product/2508973.html) [计费文档](https://help.aliyun.com/document_detail/2512928.html) |

</service>

<remark>



</remark>

<disclaimers>



</disclaimers>

## 部署 & 体验

<appcenter>
   
- :fire: 通过 [Serverless 应用中心](https://fcnext.console.aliyun.com/applications/create?template=fc-bge-collection) ，
  [![Deploy with Severless Devs](https://img.alicdn.com/imgextra/i1/O1CN01w5RFbX1v45s8TIXPz_!!6000000006118-55-tps-95-28.svg)](https://fcnext.console.aliyun.com/applications/create?template=fc-bge-collection) 该应用。
   
</appcenter>
<deploy>
    
- 通过 [Serverless Devs Cli](https://www.serverless-devs.com/serverless-devs/install) 进行部署：
  - [安装 Serverless Devs Cli 开发者工具](https://www.serverless-devs.com/serverless-devs/install) ，并进行[授权信息配置](https://docs.serverless-devs.com/fc/config) ；
  - 初始化项目：`s init fc-bge-collection -d fc-bge-collection`
  - 进入项目，并进行项目部署：`cd fc-bge-collection && s deploy -y`
   
</deploy>

## 案例介绍

<appdetail id="flushContent">

本应用实现将检索增强LLMS的基础模型

+ 多种检索模式、多语言、多粒度检索的嵌入 [BAAI/bge-m3](https://huggingface.co/BAAI/bge-m3) 

+ 重新排序器 [BAAI/bge-reranker-v2-m3](https://huggingface.co/BAAI/bge-reranker-v2-m3) 

+ 词嵌入 [BAAI/bge-large-zh-v1.5](https://huggingface.co/BAAI/bge-large-zh-v1.5) 


等部署到阿里云函数计算，并且提供了API的访问能力


</appdetail>

## 使用流程

<usedetail id="flushContent">

部署成功之后我们访问域名进入 swagger Ui界面
### 测试bge-m3

![m3](https://img.alicdn.com/imgextra/i1/O1CN01rPUY1U1Kq3n0lKi2i_!!6000000001214-0-tps-2870-990.jpg)
 
访问 /compare_sentences 接口进行调试，该接口的参数如下:

```json
{
  "source": "string",
  "compare_to": [
    "string"
  ]
}
```
其中 source 是字符串类型，表示用来对照的问题，
compare_to 是字符串的数组， 该问题相似的问题

比如输入的测试内容：
```json
{
  "source": "什么是函数计算",
  "compare_to": [
    "你好",
    "函数计算是阿里云Serverless计算服务，提供专业的Serverless架构服务托管",
    "今天天气怎么样",
    "函数计算是什么",
    "怎么用函数计算"
  ]
}
```
最终的答案如下：
```json
{
  "data": [
    0.38152584433555603,
    0.7851519584655762,
    0.36474600434303284,
    0.9892725944519043,
    0.8413630723953247
  ],
  "object": "list"
}
```
其中，data的结果展示了跟问题的近似值情况， 根据实际的表现也是符合预期

### 测试bge-rerank
![reanker](https://img.alicdn.com/imgextra/i1/O1CN01gOHwU921SGgzZkd8I_!!6000000006983-0-tps-2842-1010.jpg)
 
访问 /reank 接口进行调试，该接口的参数如下:

```json
{
  "query": "string",
  "compare_to": [
    "string"
  ]
}
```
其中 query 是字符串类型，表示查询语句， 取值一般是用户输入的问题，
compare_to 是字符串的数组， 表示跟查询语句对照的相关答案， 取值一般是经过 向量检索或者全文检索之后的答案

比如输入的测试内容：
```json
{
  "query": "什么是函数计算",
  "compare_to": [
    "你好",
    "函数计算是阿里云Serverless计算服务，提供专业的Serverless架构服务托管",
    "今天天气怎么样"
  ]
}
```
最终的答案如下：
```json
{
  "data": [
    0.0014783033167132958,
    0.9987711227165861,
    0.000016219460204138508
  ],
  "object": "list"
}
```
其中，data的结果展示了这几个答案跟问题的近似度，可以看到第二个答案的值最高，符合预期

### 测试词嵌入
![embedding](https://img.alicdn.com/imgextra/i3/O1CN01xh7Vgj1FXDPz68895_!!6000000000496-0-tps-2830-868.jpg)
访问 /embedding 进行接口调试，该接口的参数如下：
```json
{
  "input": "string"
}
```
比如输入测试的内容

```json
{
  "input": "你好"
}
```
最终答案如下：
```json
{
  "data": [
    {
      "object": "embedding",
      "embedding": [
        0.011645832099020481,
         ...
      ],
      "index": 0
    }
  ],
  "object": "list"
}
```
已经完成向量转化，符合预期




</usedetail>

## 注意事项

<matters id="flushContent">

目前暂时不支持模型更换

</matters>


<devgroup>


## 开发者社区

您如果有关于错误的反馈或者未来的期待，您可以在 [Serverless Devs repo Issues](https://github.com/serverless-devs/serverless-devs/issues) 中进行反馈和交流。如果您想要加入我们的讨论组或者了解 FC 组件的最新动态，您可以通过以下渠道进行：

<p align="center">  

| <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407298906_20211028074819117230.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407044136_20211028074404326599.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407252200_20211028074732517533.png" width="130px" > |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| <center>微信公众号：`serverless`</center>                                                                                         | <center>微信小助手：`xiaojiangwh`</center>                                                                                        | <center>钉钉交流群：`33947367`</center>                                                                                           |
</p>
</devgroup>

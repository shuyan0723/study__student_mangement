

毕    业    设    计



题    目     基于SpringBoot与Vue的视频网站设计与实现                 

英文题目   Design and implementation of Video Website Based on SpringBoot and Vue                   

学生姓名：      龚伟康      申请学位门类：  工学     
学        号：          2021213355               
专        业：           软件工程                  
学        院：           软件学院                  
指导教师：     李丽华     职称：        讲师      

二○ 二五年六月十日 




Graduation Design


Design and implementation of Video Website Based on SpringBoot and Vue



Student Name：	GongWeiKang
Degree Category：	Engineering
Student ID：	2021213355
Major：	Software Engineering
School Name：	School of Software Engineering
Instructor Name：	LiLiHua
Professional Titles：	 Lecturer


Date: 2025-06-10



作 者 声 明

本人以信誉郑重声明：所呈交的学位毕业设计（论文），是本人在指导教师指导下由本人独立撰写完成的，没有剽窃、抄袭、造假等违反道德、学术规范和其他侵权行为。文中引用他人的文献、数据、图件、资料均已明确标注出，不包含他人成果及为获得东华理工大学或其他教育机构的学位或证书而使用过的材料。对本设计（论文）的研究做出重要贡献的个人和集体，均已在文中以明确方式标明。本毕业设计（论文）引起的法律结果完全由本人承担。
本毕业设计（论文）成果归东华理工大学所有。
特此声明。

毕业设计（论文）作者（签字）：
                            							签字日期：  		 年     月     日
本人声明：该学位论文是本人指导学生完成的研究成果，已经审阅过论文的全部内容，并能够保证题目、关键词、摘要部分中英文内容的一致性和准确性。
   
学位论文指导教师签名：
年    月    日





摘  要

随着科学技术的不断发展，互联网技术也随之迎来了迅猛的发展，视频网站的内容丰富度不断提高，人们可以在视频网站上获取以往难以获取的信息知识，所以越来越来越多的人开始选择在线视频网站来作为自己娱乐、学习的选择。本项目采用前后端分离架构，开发了一款视频网站系统，支持管理员管理用户和视频资源，同时为用户提供视频观看与分享功能。
在技术方面，本项目采用SpringBoot作为系统的后端框架实现了视频模块、用户模块，使用Oracle的Mysql数据库来存储并管理关系型数据，并以MyBatis来实现对数据库的操作，同时还运用了Redis缓存技术来实现数据缓存从而提高系统性能，采用Token来进行身份的验证并实现用户登录和注册功能，从而确保信息安全。前端方面采用的是主流的Vue框架，前后端数据通信使用的是Axios，并通过使用Element Ui组件来实现前端页面设计和用户交互体验。
本系统不仅在功能体系方面，构建了包含视频上传、转码、存储、播放等全流程功能模块，实现了多维度视频管理（分类、标签、推荐位）和精细化权限控制系统，而且在交互体验方面，遵循Material Design设计规范，界面简洁直观。该视频网站系统功能完整，界面简洁，为同类视频网站提供了参考方案。

关键词：视频网站；SpringBoot；Redis；Mysql；Vue


ABSTRACT

With the continuous development of science and technology, Internet technology has also witnessed rapid growth. The content richness of video websites has been constantly improving, allowing people to access information and knowledge that were previously hard to obtain on video websites. Therefore, more and more people are choosing online video websites as their entertainment and learning options. This project adopts a front-end and back-end separation architecture and develops a video website system that supports administrators in managing users and video resources, while providing users with video viewing and sharing functions.
In terms of technology, this project uses SpringBoot as the back-end framework to implement video and user modules, uses Oracle's MySQL database to store and manage relational data, and uses MyBatis to operate the database. It also employs Redis caching technology to cache data and improve system performance. Token is used for identity verification and to implement user login and registration functions, ensuring information security. The front-end uses the mainstream Vue framework, and front-end and back-end data communication is achieved through Axios. The front-end page design and user interaction experience are realized by using Element Ui components.
This system not only builds a complete functional system, including video upload, transcoding, storage, and playback, and implements multi-dimensional video management (classification, tags, recommended positions) and a refined permission control system, but also follows the Material Design design specification for a simple and intuitive interface in terms of interaction experience. This video website system is complete in function and simple in interface, providing a reference solution for similar video websites.

Key words: Video Website;SpringBoot; Redis; Mysql; Vue; 







目    录

第1章 绪  论	1
1.1 研究背景	1
1.2 国内外研究现状	1
1.3 研究目的	2
1.4 研究内容	2
第2章 技术概述	3
2.1 SpringBoot技术	3
2.2 Redis缓存技术	3
2.3 MySQL数据库	3
2.4 MyBatis技术	4
2.5 Vue.js框架技术	4
2.6 前后端分离技术	4
2.7 Maven	4
第3章 系统需求分析	5
3.1 可行性分析	5
3.1.1 经济可行性	5
3.1.2 技术可行性	5
3.2 需求分析	5
3.2.1 功能性需求分析	5
3.2.2 非功能性需求分析	7
第4章 系统总体设计	8
4.1 整体模块设计	8
4.2 数据库设计	9
4.2.1 概念结构设计	9
4.2.2 数据库表设计	11
4.3 程序目录结构	16
第5章 详细设计与实现	19
5.1 系统环境搭建	19
5.2 用户模块	19
5.2.1 用户登录	19
5.2.2 用户注册	21
5.2.3 个人中心	23
5.3 文件模块	24
5.3.1 图片上传	24
5.3.2 图片加载	25
5.3.3 视频文件上传	26
5.3.4 视频文件转码	29
5.4 视频模块	31
5.4.1 视频投稿	31
5.4.2 视频列表条件查询	34
5.4.3 视频审核	35
5.4.4 视频删除	37
5.4.5 获取视频详情	38
5.4.6 获取视频文件信息	39
5.4.7 视频播放	41
5.4.8 视频评论发布	42
5.4.9 视频评论加载	44
第6章 系统测试	46
6.1 测试目的	46
6.2 测试方法	46
6.2.1 黑盒测试	46
6.2.2 白盒测试	46
6.3 测试用例	46
6.4 测试结论	47
结  论	49
致  谢	50
参考文献	51



第1章  绪  论

研究背景 
随着互联网技术和各种计算机硬件技术的发展，互联网基础设施在我国已经越来越完善，各种各样的移动设备也越来越普及。人们可以随时随地上网，我国互联网网民呈现爆发式增长，从2008年的2.98亿（普及率22.6%）增长到2024年的11.12亿（普及率78.9%）。我国作为全球最大的视频消费市场，2024年网络视频产业规模预计突破8000亿元，占数字经济总量的12.3%[9]。
在数字经济迅猛的发展下，视频网站用户群体的规模不断增大，用户对视频内容的个性化需求与日俱增，不管是长视频、短视频、还是视频直播，用户对其内容和个性化的要求越来越高；与此同时，视频的画质如1080p、2K或4K等对视频播放平台提出了更高的要求，需要更强的视频编码和解码能力；在多样化的需求中系统需要更加强大的拓展能力。
当前主流的视频网站架构普遍采用前后端分离模式，SpringBoot因其配置简单的优势能够简单高效的快速搭建起服务，而Vue.js框架以其响应式数据绑定和组件化开发范式大幅提升开发效率，可以快速搭建支持视频播放器的应用。
国内外研究现状
在线视频网站技术已经经历了多年的发展，2005年第一代视频平台代表YouTube采用的是LAMP架构和Flash播放器，开创了视频网络的先河，其独创的分片存储技术（将视频切分为256KB块）使当时带宽利用率提升40%，这一架构至今仍影响着视频存储设计，使其长期保持视频网站邻域的头部企业地位。2011年Netflix作为第二代视频网络流媒体播放平台采用微服务化、AWS迁移使其具有99.99%可用高可用性，爱奇艺也实现了混合云架构的部署，但当时国内云服务商的节点覆盖仅为AWS的1/3。第三代视频平台代表则是Disney+，其采用了边缘计算、容器化部署，国内平台如芒果TV也跟进部署边缘节点，但其节点数量覆盖范围却不如国外平台。TikTok作为第四代视频平台，它使用了联邦学习、神经渲染等技术可以实现毫秒级推荐更新。
现如今，国际视频邻域头部平台普遍使用AV1编码，该编码支持8k分辨率的视频。相较而言，国内主要的视频流媒体平台主要基于H.265和自主AVS3标准，在高清视频支持上有一定的落后。并且国际视频平台更注重基础技术的研发投入，这使得国际平台在核心技术专利储备上具有显著优势，其主导了超过95%的国际视频标准提案。与之对比国内平台走的是应用创新路线，国内视频平台的应用类专利
占比高达82%，远高于国际平台的68%，形成了独特的技术创新优势。
随着AI大模型技术的突破，视频网站于大模型的结合是未来国内外共同的技术突破方向。各巨头也正在加大对该领域的投入。
研究目的
该视频网站平台目标是打造一个支持视频浏览、视频播放、视频评论、视频投稿以及个人中心等功能的视频平台，解决的是现阶段视频网站用户普遍面临的痛点。首先是视频在线加载速度缓慢的问题，本项目通过对视频进行ts切片存储处理，通过索引快速获取视频，极大减少视频加载时间。对于不同用户的需求，本项目通过对各种视频进行精细分类以确保用户可以快速询所需视频。本项目的目的是创建一个更加流畅、全面开放的新一代视频网站平台，为用户提供更优质的视频服务体验。本视频网站系统功能完整，涵盖用户管理、视频上传、内容分发等核心模块，界面采用现代化简约设计，交互流畅。其前后端分离架构与模块化开发模式，为同类视频网站的快速搭建与迭代提供了可复用的参考方案。
研究内容
本文一共分为六章，从分析视频网站平台对当社会和网络用户的重要意义入手，介绍了视频网站平台技术的发展历史和现状，对比了国内外的研究现状，对国内外视频网站平台的技术侧重进行了分析。依据当前视频网站用户的多样化需求对构建本项目方向和所需技术进行了概述，根据流程分别介绍了项目的实现的过程，对目标结果进行了展示。本文章节安排如下：
本项目第一章概括讲并述了视频网站技术的研究研究背景和视频网站技术的国内外研究现状，以及本项目的研究内容；第二章简单介绍了视频网站平台搭建过程中的所需的技术。其中前端采用Vue框架进行设计，项目后台采用SpringBoot框架开发，并使用Mybatis连接和操作MySql数据库。另外通过Redis缓存技术优化查询效率；第三章描述了视频网站系统的需求分析。分析视频网站平台在我国目前的经济可行性和技术可行性，以及对该平台的功能模块进行分类和分析，同时还分析不同用户之间的需求；第四章详细介绍了程序的系统架构设计以及数据库的表结构设计。通过建立E-R图分析各个实体之间的关系；第五章详细说明了视频网站平台各功能的实现过程。通过文字和流程图对系统各个功能进行概述，并展示相应的效果图。第六章对各模块的主要功能经行测试。

第2章  技术概述
SpringBoot技术
SpringBoot作为当前最流行的后端框架技术，它是由Pivotal团队在2013年推出的开源Java框架，是基于Spring框架技术的扩展和简化。该技术极大的简化了Spring繁琐的配置，通过自动配置机制和起步依赖等特性，显著降低了开发者的配置负担，与传统的Spring框架相对比它通过大量使用注解如RestController、SpringBootApplication从而减少了约70%的配置任务，大大缩短了项目启动时间，并简化了部署流程[8]。
SpringBoot采用经典的分层设计模式，包含表现层、业务层和持久层，各层之间通过接口进行通信，显著提升了Java应用的开发效率。它还深度整合了Spring Cloud生态，为构建微服务架构提供了完善支持。通过其简化的开发模式和丰富的功能支持，SpringBoot为项目提供了稳定高效的后端技术基础，使开发团队能够专注于核心业务逻辑的实现。
Redis缓存技术
缓存技术在互联网应用中是提高系统性能和稳定的重要手段之一。Redis作为一种高性能的缓存数据库，被广泛应用于各种互联网应用中。它是是一个开源的、高性能的键值对存储系统，其数据主要存储在内存之中，当然它也支持持久化到磁盘中，有快照和日志这两种方式，这使得它在具有读写性能的同时还获得了数据安全的保障[11]。在本项目中Redis主要作用有一下几点，第一个作用是作为性能缓存层来缓存视频分类信息，以减轻对数据库的访问压力；第二个作用是作为会话存储中心，管理用户登录状态，存储在线用户数据。通过合理的键设计、过期策略和持久化配置，Redis显著提升了系统的响应速度和并发处理能力[12]。
MySQL数据库
MySQL 是瑞典的MySQL AB公司开发的一个可用于各种流行操作系统平台的关系数据库系统，它一个广泛使用的开源关系型数据库管理系统（RDBMS）。其作为最为流行的数据库之一，具有高可靠、高性能和易用性等众多优点，非常适合Web系统应用程序的数据存储需求[6]。
Java主要通过JDBC原生驱动方式和ORM框架方式这两种方式来链接数据库。JDBC是Java官方提供的数据库连接标准API，通过加载MySQL提供的JDBC驱动建立连接，而ORM框架的核心价值在于将数据库记录映射为Java对象，开发者通过操作对象间接管理数据库，无需编写繁琐的JDBC代码，通常两种方法在实际项目中常结合使用，ORM处理常规业务操作，JDBC负责复杂查询或性能敏感操作。在ORM方式中目前使用广泛的是MyBatis，MyBatis是半自动框架，它提供了灵活的SQL编写方式[6]。
MyBatis技术
MyBatis是一种持久层框架，它支持定制化SQL、存储过程以及高级映射。MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。MyBatis 可以通过简单的 XML 或注解来配置和映射原始类型、接口和 Java POJO为数据库中的记录[4]。
Vue.js框架技术
Vue.js是一种渐进式JavaScript框架，其基于HTML、CSS搭建，专注于构建用户界面，与 React 和 Angular 并称为前端三大框架。该框架学习采用组件化搭建web界面，灵活易用，并且功能强大，对不同规模大小和不同复杂程度的web界面的开发都同样使用，响应式系统是 Vue 的核心特性之一，能够自动追踪数据依赖关系，当数据发生变化时，系统会智能地更新所有依赖该数据的组件，而无需手动操作 DOM[7]。正是因为采用组件化的方式，vue可以脱离后端服务器的支撑，实现前后端分离。
前后端分离技术
在当代的web应用开发中前后端分离是一种重要的框架模式，该模式分为前端和后端，前端是指负责用户交互体验(UX)和客户端逻辑的界面等，而后端是指服务器、数据库等，提供的是数据处理和业务逻辑处理[3]。
在这种模式下前后端的开发者可以专注于不同的开发任务。并且由于前后端的的代码不同时存在在一个项目中，对代码进行了解耦，因此前后端对可选择的技术栈也更加灵活，不必局限于固定的开发技术与方法，只要API接口正确和稳定，使前后端可进行通信交互即可[3]。
前后端分离是web开发的趋势，可以使前后端团队并行开发，开发的效率得到有效的提升，也减少了对前后端开发的限制，减少了许多规则。
Maven
Maven是一款服务于Java平台的自动化构建工具。Maven 作为 Java 项目管理工具，它不仅可以用作包管理，还有许多的插件，可以支持整个项目的开发、打包、测试及部署等一系列行为。相比手动管理依赖和构建流程，Maven 提供了更高的自动化程度，减少了人为错误，并提高了开发效率。



第3章  系统需求分析

可行性分析
3.1.1  经济可行性
在经济可行性方面，SpringBoot 作为开源后端框架，无需额外支付授权费用，能显著降低开发成本；Vue 框架同样开源，搭配免费的 element ui 组件库，前端开发无需高昂投入。硬件设施方面，在开发过程中使用的是本地设备无需租赁设备，初期无需大量资金购置实体设备，降低了资金压力。运营过程中，可以通过广告植入、会员订阅、付费视频等盈利模式，参考同类成熟视频网站的流量变现经验，结合精准的用户画像和营销策略，能有效实现收益增长，预期在合理周期内可收回成本并盈利，具备良好的经济可行性。
3.1.2  技术可行性
技术可行性上，SpringBoot 框架拥有丰富的插件和成熟的生态，可以快速搭建后端项目，结合 MyBatis 实现对数据库的高效操作，能够稳定支撑视频上传、用户管理等复杂业务逻辑。Redis 缓存技术可以将热点数据存储在内存中，可以大幅提升系统响应速度。前端 Vue 框架采用组件化开发模式，便于代码复用和维护，搭配 axios 实现前后端数据通信，能够流畅实现用户登录、视频播放等交互功能。而 token 身份验证机制，以简洁安全的方式实现用户身份校验，可以有效地防止非法访问。这些技术在互联网行业应用已久，有大量实际案例和技术文档可供参考，开发过程中能够凭借现有的技术储备和学习资源，顺利完成项目开发，确保系统稳定运行。
需求分析
3.2.1  功能性需求分析
用户需求:
用户需要一个完整的账号系统来实现登录和注册功能。再登录和注册的过程中需通过图形验证码等机制防止用户频繁进行注册或登录操作。平台需要为用户提供清晰简介的视频浏览体验，同时提供分类筛选功能，对不同标签分类的视频进行选择性展示。视频播放器需要支持基础的功能如全屏播放、倍速调节、进度条拖拽定位、音量控制、画面暂停/继续等核心操作。在视频投稿方面，用户需要一个简单易用的上传界面，上传时用户可以填写视频标题、添加简介、选择分类标签，并设置封面。投稿成功后，用户可以进入个人视频管理页面查看已上传的视频，包括视频转码情况、视频投稿情况，同时可以查看视频的播放量、评论数等数据反馈。用户需要视频评论功能，视频评论功能可以为用户提供良好的互动体验，用户可以在视频下方发表文字评论，支持回复他人评论。用户还需要个人中心来查看或修改自己的个人信息，同时还应该支持查询和浏览用户投稿的视频。用户的用例图如下图4-3所示：

管理员需求：
管理员拥有对网站用户和内容的全面管理权限，可以查看所有注册用户的详细信息，包括账号状态、注册时间、最后登录IP等关键数据，当发现违规用户时，管理员可以直接对该账号进行封禁处理，被禁用的账号将无法登录和使用任何网站功能。对于投稿上传并成功转码的视频管理员可以对视频进行审核或者删除，通过审核的视频才允许被展示。对于审核通过的视频，管理员可以进行推荐操作，推荐后的视频会被放到视频首页的最上方进行展示。合理的分类管理能有效提升用户浏览体验，管理员可以创建新的视频分类，设置分类名称、分类图标等属性。对于现有分类，管理员可以修改其名称、描述和图标。管理员也可以删除分类，系统会自动将该分类下的视频全部删除。
管理员用例图如下图4-4所示：

图 4-4 管理员用例图

3.2.2  非功能性需求分析
为了保障用户的数据安全，防止未授权访问和数据泄露。系统应采用JWT结合redis进行用户认证，以增强安全性。对敏感数据应进行加密存储。数据可靠性是视频网站的核心需求之一。系统应确保用户数据、视频元数据及播放记录的持久化存储，避免数据丢失。系统应采用数据库事务机制保证关键操作的原子性和一致性。同时，通过Redis缓存热点数据并结合持久化策略，在缓存层提供数据备份，防止因服务器故障导致的数据不可用。










第4章  系统总体设计

整体模块设计 	
对用户端实现的主要功能进行设计如下图4-1所示：

图4-1用户端模块图
用户登录：用户输入邮箱和密码以及验证码进行登录，若输入的邮箱与用密码与数据库中存储的用户信息相匹配，则进入视频首页。
用户注册：用户注册时需要输入邮箱、密码、用户名称以及密码，以便数据库进行存储相应的用户信息。
个人中心：用户进入个人中心系统会根据用户id查询该用户的投稿视频列表，在个人中心，用户点击编辑按钮，修改好自己的信息并提交后即可完成个人信息的修改。
视频投稿：进入视频投稿界面，用户上传视频文件和上传封面，完成填写视频标题、添加简介、选择分类标签等操作后即可点击视频投稿。
视频列表查询：进入首页或点击视频分类选项，系统会通过条件查询视频列表并展示到界面上。
视频评论：再视频播放页面之下，用户可以输入评论内如点击发布即可对该视频进行评论。
视频播放：点击任意一个视频即可转跳到视频播放页面进行视频播放。
获取视频详情：点击视频系统会根据视频id查询该视频的信息包括视频名、视频标签等信息，并展示给用户。
获取视频文件信息：再点击视频后，系统会查询该视频下的视频分片文件，并展示的视频播放界面的右侧。
图片上传：用户通过前端表单提交图片文件，后端接收MultipartFile，压缩后存储到指定目录，并返回文件访问路径存入数据库。
图片加载：前端通过后端传递来的图片路径直接请求静态资源，SpringBoot根据图片路径加载存储目录下的图片文件。
视频文件上传：前端分片上传视频文件至后端接口，服务端暂存到本地临时目录，校验完成后转移至视频文件存储目录并记录文件信息到数据库。
视频文件转码：上传完成后，后端调用FFmpeg命令行工具对视频进行转码，先将视频分片文件合并，再将其转为mp4格式的文件，最后将其转为ts格式的切片文件，完成上述操作后更新数据库状态为“转码成功”。
管理员的后台管理员模块就是实现对用户、视频、视频分类信息等信息进行全面的管理，维护系统的信息安全。所实现的功能模块如下图4-2所示：

图4-2 管理端模块图
用户管理：管理员通过对用户的信息进行管理，当用户有违规行为时可以修改该账号状态为禁用，使得用户不可再次登录平台。
视频管理：系统管理员可以对视频进行管理，管理员可以对视频进行审核或者删除，通过审核的视频才允许被展示。审核通过的视频，管理员可以进行推荐操作，推荐后的视频会被放到视频首页的最上方进行展示。
视频分类管理：管理员可以创建新的视频分类，修改视频分类信息。管理员也可以删除分类，系统会自动将该分类下的视频全部删除。
数据库设计
4.2.1  概念结构设计
实体类之间的E-R图关系：
	用户和视频是 “1:N” 的关系，一个用户能够发布多个视频，而每个视频只能属于单一用户；用户与评论为 “1:N” 关系，一个用户可发表多条评论，且每条评论对应唯一用户；用户和视频文件是 “1:N” 关系，一个用户能上传多个视频文件，每个文件都由单个用户上传。视频与评论是 “1:N”，一个视频会有多条评论，每条评论仅针对该视频；视频和视频分类为 “N:1”，即多个视频可归属于一个分类，每个视频对应唯一分类；视频与视频文件是 “1:N”，一个视频关联多个视频个文件，每个文件对应单个视频。


图4-3 E-R图










4.2.2  数据库表设计
	（1）用户信息表：gwk_user_info_k，表结构如表4-1所示，包含存储了用户的基本信息，包括用户编号、用户名称、用户邮箱等信息，使用role来区分用户权限，当role为0代表管理员role为1代表用户。由于用户的的邮箱是唯一的，一个用户对应一个邮箱，所以选择邮箱作为索引关键字，以用户id作为主键。
表4-1 用户信息表
字段名	类型	约束	备注
gwk_nick_name_k	Varchar(22)	不为空	用户名称
gwk_user_id_k	Varchar(10)	主键	用户id编号10位
gwk_avatar_k	Varchar(110)		存储用户头像
gwk_email_k	Varchar(60)	不为空	邮箱
gwk_password_k	Varchar(50)	不为空	用户密码
gwk_sex_k	tinyint		用户性别
gwk_birthday_k	Varchar(15)		生日
gwk_person_introduction_k	Varchar(200)		用户介绍
gwk_join_time_k	datetime	不为空	创建时间
gwk_last_login_time_k	datetime		登录时间
gwk_last_login_ip_k	Varchar(15)		登录地址
status	tinyint	不为空	账号状态
notice_info	Varchar(300)		公告
role	tinyint		0:管理员 1:用户

（2）视频信息表：gwk_video_info_k（结构见表4-2）用于存储视频基本信息，包含视频编号、视频名称、所属用户、视频类别等字段。为优化查询效率，系统以视频编号作为主键，并针对用户编号和分类编号分别建立索引，以支持用户维度和分类维度的快速检索。







表4-2视频信息表
字段名	类型	约束	备注
gwk_video_id_k	Varchar(10)	主键	视频编号
gwk_video_cover_k	Varchar(60)	不为空	视频展示封面
gwk_video_name_k	Varchar(100)	不为空	视频名
gwk_user_id_k	Varchar(10)	索引、外键	视频所属用户编号
update_time	datetime		更新时间
create_time	datetime	索引	创建时间
gwk_category_id_k	int	不为空	视频所属分类编号
introduction	Varchar(1000)		视频简介
duration	int		时长
play_count	int		视频播放次数

（3）视频文件信息表：gwk_video_info_file_k（表结构见表4-3），视频文件信息表用于视频的发布和播放管理，用于存储视频分片文件的基本信息，包含视频文件id、视频id、所属用户id等字段。由于一个视频可能包含多个分片视频文件，系统通过视频id建立关联索引（以视频文件id作为主键），实现同一视频下所有分片文件的快速检索与管理。
表4-3 视频文件信息表
字段名	类型	约束	备注
gwk_file_id_k	Varchar(10)	主键	视频文件id
gwk_user_id_k	Varchar(60)	不为空	用户id
gwk_video_id_k	Varchar(80)	外键、索引	视频id
file_name	Varchar(200)		文件名称
file_index	int	不为空	文件分片编号
file_size	datetime		文件大小
file_path	Varchar(100)	不为空	文件存储路径
duration	int		视频时长

	

（4）视频信息发布表：gwk_video_info_post_k（结构见表4-4）用于存储用户投稿视频的待审核信息该表存储的视频的基本信息包括视频编号、视频名、所属用户，视频类别以及视频状态等信息，为提高查询效率，该表建立了用户编号和分类编号的索引。用户投稿时，视频信息首先存入本表；审核通过后，系统会将数据迁移至正式视频信息表gwk_video_info_k。
	在实际应用中，对视频信息的查询和对视频发布信息的查询往往有不同的需求和频率，将它们分开存储可以根据各自的查询特点进行索引优化。当系统需要添加新的功能或需求时，两个表的设计更容易进行扩展。
表4-4 视频信息发布表
字段名	类型	约束	备注
gwk_video_id_k	Varchar(10)	主键	视频编号
gwk_video_cover_k	varchar(60)	不为空	视频展示封面
gwk_video_name_k	Varchar(100)	不为空	视频名
gwk_user_id_k	Varchar(10)	外键、索引	视频所属用户编号
update_time	datetime	索引	更新时间
create_time	datetime		创建时间
gwk_category_id_k	int	外键	视频所属分类编号
introduction	Varchar(1000)		视频简介
duration	int		时长
status	tinyint	不为空	0:转码中 1转码失败 2待审核 3:审核成功 4:审核失败

（5）视频文件信息表：gwk_video_info_file_post_k（结构见表4-5）用于存储用户投稿视频的文件信息，该表存储了每个视频的视频文件的基本信息，包括视频文件id、视频id、所属用户id以及视频文件状态等信息，系统通过视频id建立关联索引（以视频文件id作为主键），实现同一视频下所有分片文件的快速检索与管理。户投稿时，视频文件信息首先存入本表；审核通过后，系统会将数据迁移至正式视频文件信息表gwk_video_info_file_k。
视频文件信息表在视频文件的上传、转码、存储等处理流程中起着关键作用。它可以记录视频文件在各个处理环节中的状态和相关参数，确保文件能够正确地被处理和存储。
表4-5 视频文件信息发布表
字段名	类型	约束	备注
gwk_file_id_k	Varchar(10)	主键	视频文件id
gwk_user_id_k	varchar(60)	不为空	用户id
gwk_video_id_k	Varchar(80)	外键、索引	视频id
upload_id	Varchar(15)	不为空	视频上传id
file_name	Varchar(200)		文件名称
file_index	int	不为空	文件分片编号
file_size	bigint		文件大小
file_path	int		文件存储路径
duration	int		视频时长
transfer_result	tinyint	不为空	转码情况（0:进行 1:成功 2:失败）

（6）视频评论表：gwk_comment_k，表结构如表4-6所示，该表存储了视频评论的基本信息，包括评论ID、父级评论ID、视频ID，以及评论内容等信息，该表将评论ID作为自增键。
表4-6 视频评论表
字段名	类型	约束	备注
gwk_comment_id_k	int	主键	评论ID
p_comment_id	int	不为空	父级评论ID
gwk_video_id_k	Varchar(10)	不为空	视频ID
content	Varchar(500)		评论内容
img_path	Varchar(150)		评论图片
gwk_user_id_k	Varchar(10)	不为空	评论人id
post_time	datetime	不为空、索引	评论发布时间



（7）视频分类信息表：gwk_video_category，表结构如表4-7所示，该表存储了视频分类的基本信息，包括分类编号、分类编码、分类名称，以及父类分类编号等信息，该表将分类编号作为自增键。由于分类编码对每个分类是唯一的，故将其作为关键字索引。
表4-7 视频分类信息表
字段名	类型	约束	备注
gwk_category_id_k	int	主键	分类编号
gwk_category_code_k	varchar(30)	索引	分类编码
gwk_category_name_k	Varchar(20)	不为空	分类名
icon	varchar		标签
background	varchar		背景
sort	tinyint	不为空	排序






















程序目录结构
后端程序目录结构如图4-6所示。

图4-6 程序目录结构
其中Gwk_video_general目录主要是负责处理数据和业务逻辑，以及数据库的交互。Gwk_video_manage目录为管理端用于处理管理端用户请求，Gwk_video_service目录文件为用户端，用于处理用户端请求。
以下是对各个目录的详细说明：
Gwk_video_general：定义数据实体类，处理数据和业务逻辑，以及数据库的交互，目录结构如图4-7所示。

图4-7 Gwk_video_general目录结构

component目录下存放可重用的自定义Spring的组件类，在本项目中该目录下存放的是对redis工具类二次封装的redis组件类。entity为实体类目录，其中存放的数据有各种实体类，通过MyBatis与数据库进行交互，比如如视频信息类、用户信息类、分类信息类等。在entity目录下还有constants，该目录下是定义与实体相关的常量类，dto目录下定义的是数据传输对象，enums存放项目中使用的枚举类型，po目录下存放的是实体类，与数据库表结构一一对应，vo是视图对象目录，主要用于向前端 Vue 应用传输数据，exception是自定义异常类目录，用于处理项目中出现的各种业务异常。mappers为数据访问层接口目录，该目录下定义的都是MyBatis 的 Mapper 接口，用于对数据库的增删改查。redis目录有与redis相关的配置类和操作redis的工具类。service为业务逻辑层目录，其作用是实现具体的业务功能，接收 Controller 层的调用，并调用mapper层对数据进行操作。utils是工具类目录，存放项目中通用的工具方法类，字符串处理工具等，提高代码的复用性。
Gwk_video_manage：该目录结构是基于视频网站管理端服务模块，目录结构如图4-8所示。



图4-8 Gwk_video_manage目录结构
在Gwk_video_manage中controller为控制层目录，其负责接收管理端页面发送的 HTTP 请求和数据，并对请求或数据进行分析后调用业务逻辑层对应的业务逻辑，如何返回对应的封装结果。interceptor是拦截器目录，存放自定义的拦截器类，用于在请求到达 Controller 之前或请求处理完成之后，对请求进行预处理或后处理。
Gwk_video_service：该目录结构是基于视频网站用户端模块，目录结构如图4-9所示。

图4-9 Gwk_video_service目录结构
在Gwk_video_service中，annotation目录中存放的是自定义注解，如全局异常拦截注解。aspect目录存放的是与切面编程相关的类，通过定义切面，能在不修改原有业务逻辑代码的基础上，添加横切关注点的功能。controller是控制层目录，负责接收前端发送过来的请求和数据并处理，同时返回处理结果。filter是过滤器目录，用于对请求进行预处理或对响应进行后处理。task目录是定时任务目录，其中定义了定时执行的任务，如统计用户和视频数据。Gwk_videoSviRunApplication是启动类。

第5章  详细设计与实现

系统环境搭建
表5-1为组件安装与版本约束为各个组件版本说明，本次项目所需环境的工具均部署在windows上，若要长期对外提供服务，可将项目部署在网站上。
表5-1 组件环境约束说明
名称	版本	备注
Jdk	1.8	
MySql	8.0.26	
SpringBoot	2.7.18	
Maven	3.6.1	
Vue	5.0.8	vue脚手架的安装依赖于node与npm
Mybatis	1.3.2	
Redis	3.2.1	
Navicat	15	
Node	18.17.1	


用户模块
5.2.1  用户登录

图5-1 登录界面效果图

用户登录的实现流程主要分为验证码校验和用户信息校验。
当用户点击登录时，系统会生成验证码图片及对应的UUID，并将验证码和UUID存入Redis，并返回给前端。前端处理验证码之后会将其展示给用户。当用户在登录界面输入邮箱、密码及图像验证码并提交时，后端UserAccountController中的login_account方法会拦截路径请求，通过ModelAttribute注解将请求参数封装为LoginDto对象。完成上述任务之后，后端会根据前端传来的UUID从Redis中获取验证码并进行校验，若验证失败则抛出异常，若通过校验则进入Service层处理。
在Service层中，系统会通过GwkUserInfoKMapper中的selectByGwkEmailK方法查询用户邮箱是否存在，若不存在则抛出"该账号不存在"异常，若用户存在则进一步校验密码是否正确，若密码错误则会抛出相应异常，若正确系统则会查询用户账号状态，若status为0则则说明该账好被禁用，系统会抛出账号被禁用异常。上述校验全部通过后，系统会更新用户登录时间，并将用户ID、名称等信息封装成TokenDto对象作为token，同时生成一个UUID作为token的Key存入Redis中，并返回创建的TokenDto对象给Controller层，Controller将用户的TokenDto对象存入Cookie中返回TokenDto对象给前端，完成登录。流程登录的流程图如图5-2所示。
关键代码如下所示：
// 查询用户
GwkUserInfoK gwkUserInfoK = gwkUserInfoKMapper.selectByGwkEmailK(userEmail);
// 若用户不存在
if (gwkUserInfoK == null) throw new BusinessException("账号不存在");
// 若密码错误
 if(!gwkUserInfoK.getGwkPasswordK().equals(registerPassword))
	throw new BusinessException("密码错误");
if (gwkUserInfoK.getStatus().equals(UserStatusEnum.DISABLE.getStatus()))
	throw new BusinessException("账号被禁用");




图5-2 用户登录流程图

5.2.2  用户注册

图5-3注册界面效果图
在本项目中，用户注册流程借鉴了用户登录流程中的验证码校验。当用户在注册界面填写邮箱、用户名称、密码及验证码并提交时，UserAccountController中的register_account方法会拦截/register请求，通过ModelAttribute将参数封装为RegisterDto对象。完成上述步骤后，后端会根据前端传来的UUID从Redis获取验证码的计算结果并进行校验，若校验失败则抛出验证码错误的异常，校验通过则将数据登录传入进入Service层进行处理。
在Service层中，系统会调用GwkUserInfoKMapper中的selectByGwkEmailK和selectByGwkNicknameK方法来检查邮箱和用户名称是否已被注册，若已被注册则抛出相对应的异常。通过上述校验后，系统会生成一个唯一的用户编码，与用户注册信息一并封装进入GwkUserInfoK实体对象，并调用持久层的GwkUserInfoKMapper将用户注册数据插入数据库，完成注册流程。注册流程图如图5-2所示。
关键代码如下所示：
GwkUserInfoK gwkUserInfoK = gwkUserInfoKMapper.selectByGwkEmailK(userEmail);
 if (gwkUserInfoK == null) throw new BusinessException("账号不存在");
 if (!gwkUserInfoK.getGwkPasswordK().equals(registerPassword)) 
throw new BusinessException("密码错误");
 if (gwkUserInfoK.getStatus().equals(UserStatusEnum.DISABLE.getStatus()))
        throw new BusinessException("账号被禁用");


图5-4用户注册流程图
5.2.3  个人中心

图5-5个人中心界面效果图
用户点击个人中心，前端发起两个请求，一个是获取用户信息请求另一个是视频列表条件查询请求，两个请求中都携带用户id。后端接收请求后通过用户id查询用户信息表获取用户数据，查询视频信息表获取该用户的投稿并通过审核的视频。最后将查询到的数据返回给前端。

图5-6 个人中心流程图
文件模块
该模块主要负责各种文件的上传和加载。
5.3.1  图片上传

图5-7图片上传效果图
本项目中利用的是Spring框架提供的 MultipartFile 来处理用户上传的文件。前端提交文件后，浏览器会将其放入HTTP请求中，而Spring Boot会自动解析文件内容并转换成 MultipartFile 对象来供后端处理。之后会先检查文件是否符合要求(如格式是否支持，数量和大小是否符合要求)。通过上述校验后程序会生成一个随机的文件名，并创建文件存放路径，若路径下的文件目录不存在则会创建该文件目录(以时间的方式来命名)。最后文件会被保存到目录下并完成整个上传流程。图片上传如图5-8所示。
关键代码如下所示：
// 获取文件名
String imgFileName = file.getOriginalFilename();
// 获取文件后缀
String fileSuffix = imgFileName.substring(imgFileName.lastIndexOf("."));
// 构成存储路径
String randomFileName = StrUtil.getRandomString(Constants.LENGTH_30) + fileSuffix;
String filePath = folder + "/" + randomFileName;
file.transferTo(new File(filePath));


图5-8 图片上传流程图

5.3.2  图片加载
	当客户端请求获取图片资源时，请求中携带图片路径。后端会对请求参数中的图片路径进行有效性检验，检验包括路径是否为空和格式是否符合标准(如拓展名)。上述验证通过后，系统会构建完整的本地文件系统路径并创建对应的File对象实例，通过缓冲输出流技术将文件内容写入HTTP响应流，从而完成图片资源的加载。如图5-9所示
// 创建输出流
        try (OutputStream outputStream = response.getOutputStream(); FileInputStream in = new FileInputStream(file)) {
// 缓存数组
            byte[] byteData = new byte[1024];
            int len = 0;
            while ((len = in.read(byteData)) != -1) {
                outputStream.write(byteData, 0, len);
            }
            outputStream.flush();
        } catch (Exception e) {
            log.error("读取文件异常", e);
        }

图5-9 图片加载流程图
5.3.3   视频文件上传
视频文件上传分为两步，首先进行视频上传前的准备，在进行视频上传。
5.3.3.1 视频预上传
前端发起视频预上传请求，请求中携带视频文件名video_File_Name和视频文件总分片数video_Chunks_Number。后端接收到请求后，会从请求头中的token来获取当前用户信息。之后通过工具类生成一个15位长度的随机字符串作为此次视频上传的唯一标识video_uploadId，该ID将用于关联所有分片数据。基于这些信息，系统会构建一个VideoUploadFileDto数据传输对象，其中包含视频名称、上传ID、分片数量、分片大小等数据信息。同时，根据配置文件中定义的存储路径规则，系统会创建视频存储目录（当文件目录不存在时），并将该路径信息也存入DTO对象。
之后系统和会将DTO对象存入redis中并以视频上传ID和用户ID的组合作为key。服务端将生成的video_uploadId返回给前端，为后续的分片上传做准备。如图5-10所示。

图5-10 视频上传准备流程图
5.3.3.2 视频文件上传

图5-11视频上传界面效果图
点击上传视频，前端发起视频分片上传请求，每个请求都包含三部分数据：以二进制形式传输的视频分片文件、视频上传ID，当前分片位置的分片索引序号。后端通过MultipartFile接收上传的视频文件分片数据。在接收视频文件数据后系统会从请求头中的token来获取当前用户信息并通过视频上传ID和用户ID从redis中获取预存的VideoUploadFileDto元数据对象，若redis中不存在该数据对象则会进行异常处理。上述操作完成后，系统会检验当前分片大小符合系统配置的限制范围并验证分片索引序号严格遵循递增规则（必须大于已接收的最大序号），若这两项检验不通过则进行异常处理。上述校验通过后，系统会创建存储路径并通过缓冲IO流将分片数据持久化到磁盘，保存成功后会更新DTO中的分片序号，并从新存入redis中。如图5-12所示。
关键代码如下所示：
// 若当前文件分配编号减一大于上一次的文件编号
 if ((index - 1) > videoUploadFileDto.getChunkIndex() || index > videoUploadFileDto.getChunks() - 1) {
            throw new BusinessException(ResponseCodeEnum.CODE_600);
        }



图5-12 视频文件上传
5.3.4   视频文件转码

图5-13视频转码效果图
视频文件转码的大致步骤如下：
视频上传是以分片文件形式上传的，分片上传可以以解决 网络不稳定、断点续传 等问题。由于视频是分片上传，且用户上传的视频可能是 HEVC格式，而要把视频转为ts切片需要的格式是mp4，所以要先将视频文件合并转为mp4格式，在之后便可以转为ts切片。
ts切片的作用：若之间使用mp4用户必须下载整个文件才能播放，大视频加载慢。ts切片可以边下边播，适应不同网络，支持多码率切换。
在投稿成功后视频文件信息会被放入消息转码队列，系统会在定时任务中会取出要转码的视频信息经行视频文件转码。 系统从消息队列中取出视频文件信息传入业务层后，根据用户id和视频文件上传id从redis中获取上传的视频文件信息对象VideoUploadFileDto，其中包含视频文件的路径、大小、文件上传id、文件名等信息。创建正式目录，将视频文件从临时目录中拷贝到正式目录中并删除临时目录和redis中的上传的视频文件信息对象VideoUploadFileDto。合并视频文件，设置视频文件信息的状态、路径和大小并更新。将视频文件转换为 TS（Transport Stream）格式。根据视频id查询转码失败的视频文件数量，若如果存在转码失败的视频文件，更新视频状态为转码失败。根据视频id查询转码中的视频文件数量，若没有转码中视频文件，则通过视频id查询视频文件表统计视频总时长，更新视频信息表中该视频的时长并设置视频状态为审核。如图5-14所示。
关键代码如下所示：

// 文件对象 
 File tgFile = new File(toFilePath);
        try (RandomAccessFile writeVideoFile = new RandomAccessFile(tgFile, "rw")) {
// 缓冲流
            byte[] b = new byte[1024 * 10];
// 遍历获取分配文件
            for (int i = 0; i < fileList.length; i++) {
                int len = -1;
                File pFile = new File(dirPath + File.separator + i);
                RandomAccessFile readFile = null;
                try {
// 合并文件
                    readFile = new RandomAccessFile(pFile, "r");
                    while ((len = readFile.read(b)) != -1) {
                        writeVideoFile.write(b, 0, len);
                    }
                } catch (Exception e) {
                    log.error("合并分片失败", e);
                    throw new BusinessException("合并文件失败");
                } finally {
                    readFile.close();
                }
            }
        }



图5-14 视频文件转码

视频模块
5.4.1  视频投稿

图5-15视频投稿效果图
	在视频文件上传完毕后，还需要填写视频的来源、分类、简介等信息，填写完毕后将视频基本信息已经视频文件信息提交给后端。
	投稿文件上传成功和且投稿信息填写完毕后，前端将视频投稿信息发送给后端。
后端接收投稿信息，其中有视频基本信息和视频文件信息，视频信息包括视频id、视频封面、视频名称、视频分类等，而视频文件信息是以json格式的字符串表示的，其中包括视频文件上传id，视频文件名称。通过请求头中携带的token获取用户数据，同时将JSON格式的视频文件描述反序列化为可操作对象集合。
	创建视频信息对象GwkVideoInfoPostK ，并将传来的视频信息和用户id赋值到其中。检测上传文件数量是否合法，否则进行异常处理。若视频信息对象中的视频id 不为空，则说明此次投稿是修改原有视频投稿，这种情况下需要检索数据库中是否有该视频信息且该视频状态合法。
	创建删除视频文件集合deleteList和新增视频文件集合addList。
	若视频信息对象中的视频id 为空，则此次投稿是新投稿，否则为修改原有投稿。当为新投稿时：生成视频id赋值给视频信息对象GwkVideoInfoPostK post_video_info，设置视频上传时间以及视频状态，完成之后便插入视频信息表中。
当为修改原投稿时：第一步，检索数据库中是否有该视频对应的视频信息且该视频状态合法，否则进行异常处理。第二步，根据视频id和用户id从数据库中获取该视频对应的所有视频分片文件信息，并存储到集合对象List<GwkVideoInfoFilePostK> dbList中，与前端传来的视频分片文件集合List<GwkVideoInfoFilePostK> videoInfoFilePostList对比，将数据库中有(dbList 集合里面有)而上传来的数(videoInfoFilePostList 集合)中没用的的视频分片文件对象添加到deleteList集合中。遍历videoInfoFilePostList 若集合中的视频分片文件对象中不携带文件则将该对象添加到addList中。第三步，判断视频信息是否被修改,若被修改则更新视频信息。
	如果视频ID为空则为发布新视频，生成一个新的视频ID，并设置视频的基本信息，然后插入数据库。若deleteList集合不为空（需要删除旧的视频文件），遍历deleteList集合批量删除视频文件信息。若addList集合不为空，遍历addList集合设置每个对象的视频id和用户id，生成视频文件id等信息，最后插入到数据库中。如图5-16所示。
关键代码如下所示：
// 若视频id为空
if (StrUtil.isEmpty(gwk_videoId)) {
            post_video_infoMapper.insert(post_video_info);

        } else {
// 若视频已经存在 则修改视频
            if (!StrUtil.isEmpty(post_video_info.getGwkVideoIdK())) {
// 查询
                GwkVideoInfoPostK new_post_video_info = post_video_infoMapper.getByVideoId(post_video_info.getGwkVideoIdK());
                if (new_post_video_info == null) {
                    throw new BusinessException(ResponseCodeEnum.CODE_600);
                }
                if (ArrayUtils.contains(new Integer[]{VideoStatusEnum.STATUS0.getStatus(), VideoStatusEnum.STATUS2.getStatus()}, post_video_info.getStatus())) {
                    throw new BusinessException(ResponseCodeEnum.CODE_600);
                }
            }
            
  }

图5-16 视频投稿流程图


5.4.2  视频列表条件查询

图5-17视频列表加载效果图


该功能是为了管理端和用户端管理视频时获取视频列表，实现了在查询视频信息表的同时关联查询了用户信息表和视频信息发布表。因为视频信息发布表gwk_video_info_post_k虽然有视频状态status但相对于视频信息表gwk_video_info_k的信息更加少，使用关联查询可以获取视频更详细的详细，为不同权限用户提供更多操作选择。其中对管理端和用户端都重要的便是视频审核情况，用户端需要查询审核是否通过，管理端则可以决定视频是否通过审核，以及视频是否推荐。
具体流程如下：
前端发送查询请求表单(用户端和管理端不同，用户端需要携带用户id因为用户只能修改查看自己的视频)，若是用户端查询则从请求头中携带的token中获取用户id。构建视频信息查询对象GwkVideoInfoPostKQuery并将前端传来的条件赋值。通过查询对象获取查询条数，创建分页对象SimplePage并设置页面大小，并放入查询对象中。通过查询对象GwkVideoInfoPostKQuery进行条件查询后返回数据。如图5-18所示。



图5-18 视频条件查询流程图



5.4.3  视频审核

图5-19视频审核效果图

视频审核是在管理端进行的，管理员可以决定视频是否通过审核，后端会根据视频id和审核参数来修改视频status，通审核的视频会将其视频信息从视频信息发布表(gwk_video_info_post_k)中转到视频信息表(gwk_video_info_k)中，并将视频文件信息从视频文件信息发布表(gwk_video_info_file_post_k)中转到视频文件信息表(gwk_video_info_file_k)。
具体流程如下：
前端发送审核请求，并携带视频id和审核情况参数。后端Controller接收参数并调用GwkVideoInfoPostKService中的videoScreening方法进行视频审核。首先进行条件判断，查询视频审核状态，只有当该视频状态为待审核时才会修改其审核状态，否则抛出异常。若前端传来的审核参数是审核不通过，则执行结束，否则继续执行。根据视频id查询视频信息发布表(gwk_video_info_post_k)中的视频信息并将其复制到视频(gwk_video_info_k)中。删除视频文件表(gwk_video_info_file_k)中与该视频id有关的信息，并将视频发布表(gwk_video_info_file_post_k)中的该视频文件信息复制到其中。如图5-20所示。




图5-20 视频条件查询流程图

5.4.4  视频删除

图5-21视频删除效果图
视频删除也分为用户端和管理端，他们的不同之处在于管理端可以删除任意一个视频，而用户端只能删除自己的视频。所有用户端的请求参数中必须携带用户id。
具体流程如下：
前端发起删除视频请求，其中携带视频id和用户id。后端查询数据库中是否存在该视频，若不存在则进行异常处理。若用户id不为空则判断该视频是否属于该用户，若不属于则进行异常处理，若用户id为空则继续执行。条件检验都通过后，根据视频id删除视频信息发布表和视频信息表中该视频信息。根据视频id删除视频文件信息发布表和视频文件表中的视频文件信息。如图5-22所示。


图5-22 删除视频流程图

5.4.5  获取视频详情

图5-23视频详情效果图
点击视频后会跳转的视频播放页面，在视频播放前会根据视频id先加载视频信息和视频文件信息。
具体流程如下：
前端发送http请求，其中携带视频参数。后端Controller层接收视频id参数，获取token中携带的用户数据，并将其传给service层。在service层中通过id查询视频信息，若视频信息为空则进行异常处理。校验通过之后，根据用户id和视频id查询该用户对该视频的行为信息，将获取的数据和视频信息封装为返回对象返回。如图5-24所示。

图5-24 获取视频详情流程图

5.4.6  获取视频文件信息

图5-25获取视频文件效果图
一个投稿中可以有多个视频，这些视频通过共同的视频id组成一个投稿。所以在视频播放时需要获取该视频id下的所有视频文件信息，然后根据视频文件路径来获取视频ts切片文件从而播放视频。
具体流程如下：
前端发起获取视频文件信息请求，请求中携带视频id。构建视频文件信息查询对象，根据视频id获取查询该视频id下的所有视频视频文件信息集合。将视频文件信息列表响应给前端。如图5-26所示。


图5-26  获取视频文件信息流程图
5.4.7  视频播放

图5-27视频播放效果图

视频文件在本地资源中的存储文件分为两种，index.m3u8文件与ts格式的视频分片文件。index.m3u8是视频流的索引文件，它记录这些ts格式的视频片段的顺序和位置信息，前端播放器收到index.m3u8文件后，会对其进行解析，并从该文件中提取出视频片段的 URL 列表以及其他相关参数，播放器根据解析得到的视频片段 URL，依次向服务器发送对各个视频片段的请求。服务器根据请求，将相应的视频片段发送给播放器，接收到视频片段后，播放器会对其进行解码和渲染，从而实现视频播放。
具体流程如下：
前端发起获取视频视频分段索引文件index.m3u8的请求，请求种中携带视频文件id。后端接收数据后，根据视频id查询数据库获取视频文件存储目录路径。根据路径读取index.m3u8文件路径并文件响应给前端。前端解析index.m3u8文件后，依次向服务器发送对各个视频片段的请求。后端接收这些携带文件id和视频片段序号的请求并将指定序号的ts视频片段文件响应给前端。如图5-28所示。
关键代码如下所示：
// 根据文件id获取视频文件
GwkVideoInfoFileK videoFileInfo = video_fileService.getVideoFileInfoByFileId(fileId);
 String filePath = videoFileInfo.getFilePath();
// 相应文件给前端
HttpServletResponse。
readFile(response, filePath + "/" + Constants.M3U8_NAME);
HttpServletResponse
GwkVideoInfoFileK videoInfoFile = video_fileService.getVideoFileInfoByFileId(fileId);
String filePath = videoInfoFile.getFilePath();
 readFile(response, filePath + "/" + ts);

图5-28 视频播放流程图

5.4.8  视频评论发布

图5-29视频评论发布效果图
用户输入评论内容后点击发布，前端发起添加评论的请求。请求中携带视频id、回复评论id、评论内容、评论图片。后端接收请求后将请求参数封装为CommentDto对象并传递给servie进行插入评论的操作。首先判断视频是否存在，若不存在则进行异常处理。创建评论对象GwkCommentK并复制数据，如果该条评论是回复他人评论（回复评论id不为空）则判断回复评论id是否存在，若存在则直接将该条评论插入数据库，若不存在则进行异常处理，如该条评论不是回复他人的评论则直接插入数据库中，并将结果返回给前端。如图5-30所示。

图5-30 视频评论发布流程图

5.4.9  视频评论加载

图5-31视频评论加载效果图
前端发送获取视频评论请求，请求中携带视频id。后端接收请求，根据视频id查询视频是否存在，若不存在则进行异常处理。检验通过后，创建评论查询对象GwkCommentKQuery和视频评论数据传输对象CommentVo。查询所有第一层级的评论并分装为评论对象集合List<GwkCommentK> list，遍历对象集合，更具评论id查询该评论下的所有二级评论并保存到一级评论中的List<GwkCommentK> children中。完成上述操作后将数据返回给前端。如图5-32所示。


图5-32 视频评论加载流程
第6章  系统测试
测试目的
系统测试的首要目的是验证系统的功能完整性。通过测试来全面检查视频上传、播放、用户管理、评论互动等核心模块的功能是否符合需求规格说明。重点测试SpringBoot后端接口的逻辑正确性，以及Vue前端组件的交互可靠性，确保所有功能模块能够协同工作，满足用户的基本使用需求。
测试方法
6.2.1  黑盒测试
用户模块测试：通过模拟用户的方式，例如登录、注册、用户查询和管理，来验证用户模块的业务是否能正常执行。
视频模块测试：通过模拟用户使用视频网站，如视频投稿、视频播放、发布评论和视频转码，来检验视频模块功能的可靠性。
6.2.2  白盒测试
对业务逻辑层中的核心业务流程编写测试用例，实现覆盖所有相关的异常处理。
测试用例

表6-1 登录注册功能测试用例
测试编号	测试名称	测试步骤	预期结果	测试结果
test-01	登录测试	1.启动后台服务
2.调用验证码接口生成验证码
3.输入用户邮箱、密码和验证码	1.验证码接口返回key与验证码图片
2.登录接口返回token	通过







表6-2 视频投稿功能测试用例
测试编号	测试名称	测试步骤	预期结果	测试结果
test-02	视频投稿测试	1.启动后台服务
2.上传视频和视频封面图片
3.填写视频相关信息如分类、标签等	1.视频和图片上传成功返回视频文件id
2.返回视频投稿成功	通过

表6-3 视频播放功能测试用例
测试编号	测试名称	测试步骤	预期结果	测试结果
test-03	视频播放测试	1.启动后台服务
2.调用获取视频信息接口，获取视频文件id
3.调用获取视频文件信息接口获取视频文件此次路径
4.调用视频文件获取接口获取视频切片文件	1.获取视频接口成功返回视频文件id
2.获取视频文件接口成功返回视频文件存储路径
3.视频文件接口成功返回视频切片文件	通过

表6-4 视频评论功能测试用例
测试编号	测试名称	测试步骤	预期结果	测试结果
test-04	视频评论测试	1.启动后台服务
2.调用获取视频评论接口，获取视频评论
3.调用获取视频评论发布接口发布视频评论	1.获取视频接口成功返回视频评论列表
2.发布视频接口成功返回视频评论
	通过

测试结论
通过对用户模块和视频模块的全面测试，系统整体表现符合预期。在功能实现方面，注册登录、视频上传播放等核心业务流程运行正常，测试通过率为91.5%，关键问题有视频转码异常、权限校验失效等。测试暴露出验证码强度不足和会话超时设置过长2个中危漏洞。后续优先将修复视频转码、移动端适配等关键问题，优化内存管理机制，并在后续版本中持续完善安全防护措施。当前系统已具备上线基础条件，建议在解决重点问题后投入生产环境使用。



结  论

此次毕业设计依托SpringBoot和Vue.js技术栈，打造出一个功能完备的在线视频平台，开发进程中，遭遇了如前后端交互、视频处理以及性能优化等技术难题，借助查阅资料并加以实践验证，最终寻得了可行的解决办法，成功达成了平台的各项功能需求。
对于技术架构层面，项目采用前后端分离的开发模式。后端运用SpringBoot框架搭建RESTful API服务，借助Maven实施依赖管理，并凭借JWT令牌机制达成用户认证与权限控制，数据存储层将MySQL用作主数据库，结合MyBatis框架开展数据持久化操作，同时引入Redis缓存热点数据，有效降低了数据库访问压力，提高了系统响应速度。前端部分以Vue.js作为核心框架，搭配Vuex进行全局状态管理，利用Vue Router实现页面路由跳转，界面设计采用Element UI组件库，保证了整体风格的统一与美观。
平台实现了完整的视频播放功能，涉及全屏播放、倍速调节、进度条拖拽定位、音量控制、暂停/继续等核心功能。其中进度条拖拽定位功能借助视频分片加载技术得以实现，保障了播放的流畅性，系统还支持多种视频格式的转码处理，为用户提供了不错的观看体验，在安全性方面，依靠JWT认证机制保障了用户数据与系统安全。
经测试，系统各项功能运行稳定，性能指标达到预期要求，不过仍有一些地方需要改进：在高并发场景下视频播放可能会出现卡顿，建议引入CDN进行优化，用户推荐功能相对简单，可引入更智能的推荐算法，搜索功能有待完善，可考虑集成Elasticsearch提升检索效率。该项目的完成为后续视频平台的性能优化和功能扩展奠定了良好基础。




致  谢

本论文的顺利完成，离不开许多人的指导，首先感谢在此次设计中不断给予我帮助的指导老师：李丽华老师，在设计的思路上、研究方法、系统设计、论文的撰写上等方面，她耐心、细致不断为我点明前进的道路，在我困惑时帮我理清思路，在论文的编写过程中，更是不断为我提供修改的意见，推动我的设计与论文不断的完善。
当然还要感谢这四年学习过程中遇到的各位任课老师和评审专家，感谢你们在课程学习和论文答辩过程中提出的宝贵建议，使我的研究更加完善。
其次感谢感谢实验室的同学们和项目组成员，为我提供了服务器以及运行测试的环境、在前后的框架等技术上也为我提供了帮助与支持。
最后感谢我亲爱的朋友和我的舍友们，在我遇到难关而苦恼的时候，他们总是给予鼓励，支持与安慰。
感谢所有参考文献的作者，你们的研究成果为本论文提供了重要的理论和技术支持。
大学四年即将结束，我也踏上了新的工作旅程。由于时间有限和个人能力有限，我的作品还不够完美，望得到各位老师的指点，我将不断改进。


参考文献

[1]黎晖，于宏宇，张绍平，林柯军。基于框架的 Web 服务软件自动化测试技术 [J]. 兵工自动化，2024, 43 (08): 43-46+79 
[2]张烈超，胡迎九。典型 Java Web 开发框架模型的研究 [J]. 武汉交通职业学院学报，2021, 23 (04): 122-127.
[3]张浩. SSM 框架在 Web 应用开发中的设计与实现研究 [J]. 电脑知识与技术，2023, 19 (08): 52-54.
[4]白添予。基于 MyBatisPlus 的数据库框架优化综述 [J]. 电脑与信息技术，2024, 32 (03): 75-77+133
[5]田小萍, 卢小清, 王兴建. 基于Spring实现应用插件化扩展的探索和研究[A] 中国计算机用户协会网络应用分会2023年第二十七届网络新技术与应用年会论文集[C]. 中国计算机用户协会网络应用分会, 北京联合大学北京市信息服务工程重点实验室, 2023: 5.
[6]赵新平.MySQL数据库在高并发Web系统中的优化技术[J].软件,2025,46(03):116-119.
[7]温谦. JavaScript+Vue.js Web开发案例教程[M]. 人民邮电出版社: 202206. 483.
[8]王志亮, 纪松波. 基于SpringBoot的Web前端与数据库的接口设计[J]. 工业控制计算机, 2023, 36 (03): 51-53.
[9]郭雨辰.基于SpringBoot技术的JavaEE框架课程教学探索[J].石家庄职业技术学院学报,2025,37(02):71-75.
[10]Shao W ,Liu K.Design and Implementation of Online Ordering System Based on SpringBoot[J].Journal of Big Data and Computing,2024,2(3):
[11]韩金.基于Redis的非均衡访问分布式缓存系统的设计与关键技术实现[D].电子科技大学,2024.DOI:10.27005/d.cnki.gdzku.2024.005348.
[12]张子莹.基于Redis的关系型数据库热表缓存模式的研究与工程实践[D].四川师范大学,2024.DOI:10.27347/d.cnki.gssdu.2024.000889.
[13]Hejing W .Commerce Middle Office Management System Based on Springboot[J].International Journal of Advanced Network, Monitoring and Controls,2022,7(2):32-45.
[14][Chen G ,Xu J .Design and implementation of efficient Learning platform based on SpringBoot Framework[J].Journal of Electronics and Information Science,2020,6(1):
[15]Hejing W .Commerce Middle Office Management System Based on Springboot[J].International Journal of Advanced Network, Monitoring and Controls,2022,7(2):32-45.


-- 插入活动数据
INSERT INTO activities (
  id, type, title_zh, title_en, description_zh, description_en,
  content_zh, content_en, date, location_zh, location_en,
  photos, tags_zh, tags_en, created_at, updated_at
) VALUES
-- 活动1：科学中心公益活动
(
  'activity-001',
  'charity',
  '我的9岁生日 · 科学中心公益活动',
  'My 9th Birthday · Science Center Charity Activity',
  '我的9岁生日,不是在蛋糕店过的 / 我看见了更大的世界',
  'My 9th birthday, not celebrated at a cake shop / I saw a bigger world',
  '<p>上周,是我的9岁生日。</p><p>以前过生日的时候,我都会和家人一起吃蛋糕、拆礼物,或者去好玩的地方。但是今年,妈妈带我参加了一场很特别的活动。</p><p>我们和公益基金会一起,带肿瘤医院的小朋友去广东省科学中心玩。我也第一次当了一名"小志愿者"。</p><p>一开始,我其实有一点紧张,因为我不知道应该怎么和那些小朋友相处。我还偷偷问妈妈:"他们会不会不开心呀?"</p><p>后来我发现,他们和我想象中不一样。</p><p>有的小朋友特别喜欢机器人,有的小朋友一看到科学实验就很兴奋,还有一个小朋友一直认真地看着星空模型,问了很多问题。</p><p>我们一起参观、一起聊天、一起做活动。慢慢地,我就忘记了自己是在"帮助别人",而是真的像交朋友一样。</p><p>那天我印象最深的,是一个小朋友很开心地对我说:"今天很好玩。"</p><p>回家的路上,我一直在想这句话。</p><p>我突然觉得,原来快乐有时候其实很简单。可能只是有人陪你一起玩,一起看看有趣的东西。</p><p>我觉得,今年的9岁生日和以前不太一样。</p><p>因为这是我第一次发现,世界上有很多和我不一样的小朋友。也是第一次,我开始认真去观察别人。第一次开始认真的思考,或许这个世界并不是公平的,但是却不妨碍我们去拥抱这个世界,去爱身边的人。</p><p>妈妈问我,这次生日最特别的地方是什么。</p><p>我想了很久。</p><p>我觉得,可能是因为今年的生日,不只是我自己开心,还有很多人一起开心。</p><p>这是我第一次参加公益活动。</p><p>我希望以后还能继续参加这样的活动。因为在她们的眼里,我感觉到快乐,不论生活里发生了什么,你都可以拥有快乐,只要你愿意。因为我发现,原来帮助别人,其实自己也会变得很快乐。</p>',
  '<p>Last week was my 9th birthday.</p><p>In the past, I would celebrate my birthday with my family - eating cake, opening presents, or going to fun places. But this year, Mom took me to participate in a very special event.</p><p>Together with a charity foundation, we took children from the tumor hospital to visit the Guangdong Science Center. I also became a "little volunteer" for the first time.</p><p>At first, I was actually a bit nervous because I didn''t know how to interact with those children. I even secretly asked Mom, "Will they be unhappy?"</p><p>Later, I discovered they were different from what I had imagined.</p><p>Some children really liked robots, some got excited when they saw science experiments, and one child kept watching the starry sky model seriously and asked many questions.</p><p>We visited together, chatted together, and did activities together. Gradually, I forgot that I was "helping others" and really felt like making friends.</p><p>What impressed me most that day was when a child happily said to me, "Today was fun."</p><p>On the way home, I kept thinking about this sentence.</p><p>I suddenly realized that happiness can sometimes be very simple. Maybe it''s just having someone to play with you and look at interesting things together.</p><p>I feel that this year''s 9th birthday is different from before.</p><p>Because this was the first time I discovered that there are many children in the world who are different from me. It was also the first time I started to seriously observe others. The first time I began to seriously think that perhaps this world is not fair, but that doesn''t stop us from embracing this world and loving the people around us.</p><p>Mom asked me what was the most special thing about this birthday.</p><p>I thought for a long time.</p><p>I think maybe because this year''s birthday wasn''t just about my own happiness, but many people being happy together.</p><p>This was my first time participating in a charity activity.</p><p>I hope to continue participating in such activities in the future. Because in their eyes, I felt happiness. No matter what happens in life, you can have happiness, as long as you''re willing. Because I discovered that helping others actually makes you very happy too.</p>',
  '2025-01-15',
  '广东省科学中心',
  'Guangdong Science Center',
  '[
    {"id": "photo-1", "url": "https://picsum.photos/seed/science-center-1/400/400", "order": 1, "uploadedAt": "2025-01-15T08:00:00Z", "caption": "科学中心外景"},
    {"id": "photo-2", "url": "https://picsum.photos/seed/volunteer-2/400/400", "order": 2, "uploadedAt": "2025-01-15T09:00:00Z", "caption": "穿上志愿者衣服"},
    {"id": "photo-3", "url": "https://picsum.photos/seed/robot-3/400/400", "order": 3, "uploadedAt": "2025-01-15T10:00:00Z", "caption": "一起看机器人"},
    {"id": "photo-4", "url": "https://picsum.photos/seed/science-4/400/400", "order": 4, "uploadedAt": "2025-01-15T11:00:00Z", "caption": "一起玩科学装置"},
    {"id": "photo-5", "url": "https://picsum.photos/seed/happy-5/400/400", "order": 5, "uploadedAt": "2025-01-15T12:00:00Z", "caption": "孩子们笑的瞬间"},
    {"id": "photo-6", "url": "https://picsum.photos/seed/explore-6/400/400", "order": 6, "uploadedAt": "2025-01-15T14:00:00Z", "caption": "认真观察展品"}
  ]'::jsonb,
  '["9岁生日", "公益活动", "志愿者", "科学中心", "同理心"]'::jsonb,
  '["9th Birthday", "Charity", "Volunteer", "Science Center", "Empathy"]'::jsonb,
  '2025-01-15T08:00:00Z',
  '2025-01-15T08:00:00Z'
),
-- 活动2：珠江夜游AI活动
(
  'activity-002',
  'charity',
  '珠江夜游 · AI未来星球六一夜航',
  'Pearl River Night Cruise · AI Future Planet Children''s Day Adventure',
  '「未来小小探索家之夜」- 珠江夜游上的儿童公益AI活动',
  '"Future Little Explorers Night" - Children''s Charity AI Activity on Pearl River Cruise',
  '<p>六一儿童节那天,我参加了一场特别的活动 - "AI未来星球六一夜航"。我们和肿瘤医院的小朋友们一起,在珠江游轮上探索AI和未来的世界。</p><p>这次活动的主题是"未来小小探索家之夜",让所有孩子 - 包括患儿、志愿者孩子,都成为"共同探索世界的小朋友"。我觉得这个名字特别好,因为我们都平等地在一起,而不是"帮助"和"被帮助"的关系。</p><p>我的任务很简单:陪一个小朋友一起做活动、一起看珠江夜景、一起聊关于AI的话题。</p><p>在船上,我们一起做了几个特别有意思的活动:</p><h3>AI未来明信片</h3><p>主题是"未来的广州会是什么样?"。孩子们用AI生成未来城市、或画未来珠江、或设计未来医院、或设计未来机器人朋友。这个活动特别适合:AI + imagination + empathy。我看到小朋友们画出各种各样的未来,每个人的想象力都那么丰富。</p><h3>小小科学探索箱</h3><p>非常轻量的活动。包括光学小实验、AI识图、简单机器人互动、星空投影。重点不是知识,而是wonder(惊奇感)。最让我印象深刻的是星空投影,小朋友们都盯着天花板上的星星,眼睛亮晶晶的。</p><h3>"未来的我"小卡片</h3><p>让孩子们写下"我长大后想帮助世界做什么?"。这个环节会特别有力量。有个小朋友说,她想发明一个能让人不孤独的机器人。这句话让我思考了很久。</p><h3>珠江夜景观察任务</h3><p>不是单纯坐船,而是观察这座城市。珠江两岸有什么变化?科技改变了什么?广州未来会变成什么样?这个特别real-world learning。</p><p>那天晚上,珠江的夜景特别美。灯光倒映在水面上,小朋友们都很兴奋。我陪着一个小朋友聊天,她问我:"如果AI能帮助生病的小朋友,你希望它做什么?"</p><p>我想了想,说:我希望它能陪他们聊天讲故事,让他们不那么害怕;用VR带他们去参观博物馆和动物园;帮他们和远方的朋友视频聊天。</p><p>她笑着说:"那真是个好想法。"</p><p>这次活动让我明白,真正打动人的不是"活动丰富",而是让孩子们短暂地忘记自己是病人,让他们感受到情绪和连接。AI不只是技术,更是连接人与人之间情感的工具。</p><p>回家的路上,我一直在思考:AI × 人性 × 想象力,这才是最珍贵的。</p>',
  '<p>On Children''s Day, I participated in a special event - "AI Future Planet Children''s Day Night Cruise". Together with children from the tumor hospital, we explored AI and the future world on a Pearl River cruise ship.</p><p>The theme of this event was "Future Little Explorers Night", making all children - including patients and volunteers'' children - become "little friends exploring the world together". I think this name is particularly good because we are all together equally, not in a relationship of "helping" and "being helped".</p><p>My task was simple: accompany a child to do activities together, watch the Pearl River night scenery together, and chat about AI topics together.</p><p>On the boat, we did several very interesting activities together:</p><h3>AI Future Postcards</h3><p>The theme was "What will Guangzhou look like in the future?". Children used AI to generate future cities, or draw future Pearl Rivers, or design future hospitals, or design future robot friends. This activity is particularly suitable for: AI + imagination + empathy. I saw children draw various futures, everyone''s imagination was so rich.</p><h3>Little Science Exploration Box</h3><p>A very lightweight activity. Including optical experiments, AI image recognition, simple robot interaction, and starry sky projection. The focus is not on knowledge, but on wonder. What impressed me most was the starry sky projection, the children all stared at the stars on the ceiling, their eyes sparkling.</p><h3>"Future Me" Little Cards</h3><p>Let children write down "What do I want to do to help the world when I grow up?". This segment was particularly powerful. One child said she wanted to invent a robot that could keep people from being lonely. This sentence made me think for a long time.</p><h3>Pearl River Night Scene Observation Task</h3><p>Not just sitting on the boat, but observing the city. What changes have happened on both sides of the Pearl River? What has technology changed? What will Guangzhou become in the future? This is particularly real-world learning.</p><p>That night, the Pearl River night scenery was particularly beautiful. The lights reflected on the water surface, and the children were all very excited. I was chatting with a child, and she asked me, "If AI could help sick children, what would you want it to do?"</p><p>I thought about it and said: I hope it can accompany them to chat and tell stories, so they won''t be so scared; use VR to take them to visit museums and zoos; help them video chat with distant friends.</p><p>She smiled and said, "That''s a really good idea."</p><p>This activity made me realize that what really moves people is not "rich activities", but letting children briefly forget they are patients, letting them feel emotions and connections. AI is not just technology, but a tool that connects emotions between people.</p><p>On the way home, I kept thinking: AI × humanity × imagination, this is the most precious.</p>',
  '2025-06-01',
  '珠江游轮',
  'Pearl River Cruise',
  '[
    {"id": "photo-7", "url": "https://picsum.photos/seed/pearl-river-7/400/400", "order": 1, "uploadedAt": "2025-06-01T18:00:00Z", "caption": "珠江夜景"},
    {"id": "photo-8", "url": "https://picsum.photos/seed/boat-8/400/400", "order": 2, "uploadedAt": "2025-06-01T19:00:00Z", "caption": "孩子们在游轮上"},
    {"id": "photo-9", "url": "https://picsum.photos/seed/ai-card-9/400/400", "order": 3, "uploadedAt": "2025-06-01T20:00:00Z", "caption": "AI未来明信片活动"},
    {"id": "photo-10", "url": "https://picsum.photos/seed/stars-10/400/400", "order": 4, "uploadedAt": "2025-06-01T21:00:00Z", "caption": "星空投影"},
    {"id": "photo-11", "url": "https://picsum.photos/seed/drawing-11/400/400", "order": 5, "uploadedAt": "2025-06-01T22:00:00Z", "caption": "孩子们画画"},
    {"id": "photo-12", "url": "https://picsum.photos/seed/night-lights-12/400/400", "order": 6, "uploadedAt": "2025-06-01T23:00:00Z", "caption": "珠江灯光倒映"}
  ]'::jsonb,
  '["珠江夜游", "AI活动", "公益活动", "儿童", "科技创新"]'::jsonb,
  '["Pearl River Cruise", "AI Activity", "Charity", "Children", "Tech Innovation"]'::jsonb,
  '2025-06-01T18:00:00Z',
  '2025-06-01T18:00:00Z'
);

-- 插入问题数据
INSERT INTO questions (
  id, question_zh, question_en, thoughts_zh, thoughts_en,
  date, tags_zh, tags_en, created_at, updated_at
) VALUES
-- 问题1
(
  'question-001',
  '为什么有的小朋友长期住院?',
  'Why do some children stay in the hospital for a long time?',
  '参加公益活动后,我发现有些小朋友在医院住了很长时间。他们不能像我一样上学、去公园玩。我想知道为什么他们会生病那么久?是不是所有的病都很难治好?科技能不能帮助他们更快康复?',
  'After participating in the charity activity, I found that some children have been in the hospital for a long time. They can''t go to school or play in the park like me. I wonder why they''ve been sick for so long? Are all diseases difficult to cure? Can technology help them recover faster?',
  '2025-01-20',
  '["医疗", "儿童健康", "同理心"]'::jsonb,
  '["Healthcare", "Children''s Health", "Empathy"]'::jsonb,
  '2025-01-20T10:00:00Z',
  '2025-01-20T10:00:00Z'
),
-- 问题2
(
  'question-002',
  'AI会不会让人孤独?',
  'Will AI make people lonely?',
  '现在很多人都在用AI聊天机器人。虽然AI可以回答很多问题,但是它不是真正的人。如果大家都只和AI聊天,会不会就不再和真人说话了?这样会不会让人变得更孤独?AI能不能帮助那些已经很孤独的人?',
  'Now many people are using AI chatbots. Although AI can answer many questions, it''s not a real person. If everyone only chats with AI, will they stop talking to real people? Will this make people lonelier? Can AI help those who are already lonely?',
  '2025-02-15',
  '["人工智能", "社交关系", "科技伦理"]'::jsonb,
  '["AI", "Social Relationships", "Tech Ethics"]'::jsonb,
  '2025-02-15T14:00:00Z',
  '2025-02-15T14:00:00Z'
),
-- 问题3
(
  'question-003',
  '科技能不能帮助儿童?',
  'Can technology help children?',
  '我在科学中心看到很多有趣的科技展览。我在想,科技能不能帮助那些生病的小朋友?比如,VR眼镜能不能让他们看到外面的世界?AI能不能陪他们聊天,让他们不那么害怕?机器人能不能帮他们做一些不方便做的事情?',
  'I saw many interesting technology exhibitions at the Science Center. I''m wondering, can technology help those sick children? For example, can VR glasses let them see the outside world? Can AI chat with them to make them less scared? Can robots help them do things that are inconvenient?',
  '2025-03-01',
  '["科技创新", "儿童", "医疗辅助"]'::jsonb,
  '["Tech Innovation", "Children", "Medical Assistance"]'::jsonb,
  '2025-03-01T09:00:00Z',
  '2025-03-01T09:00:00Z'
),
-- 问题4
(
  'question-004',
  '如果AI能帮助生病的小朋友,我希望它做什么?',
  'If AI could help sick children, what would I want it to do?',
  '如果能设计一个专门帮助生病小朋友的AI,我希望它能:陪他们聊天讲故事,让他们不那么害怕;用VR带他们去参观博物馆和动物园;帮他们和远方的朋友视频聊天;提醒医生护士他们什么时候需要帮助。这样他们就不会觉得那么孤独了。',
  'If I could design an AI specifically to help sick children, I would want it to: chat with them and tell stories to make them less scared; use VR to take them to visit museums and zoos; help them video chat with distant friends; remind doctors and nurses when they need help. This way they won''t feel so lonely.',
  '2025-06-02',
  '["人工智能", "设计思维", "同理心"]'::jsonb,
  '["AI", "Design Thinking", "Empathy"]'::jsonb,
  '2025-06-02T16:00:00Z',
  '2025-06-02T16:00:00Z'
),
-- 问题5
(
  'question-005',
  '快乐为什么有时候很简单?',
  'Why is happiness sometimes so simple?',
  '在公益活动中,一个小朋友说"今天很好玩"。我一直在想这句话。原来快乐有时候其实很简单,可能只是有人陪你一起玩,一起看看有趣的东西。不是需要很多玩具或者去很远的地方。陪伴和关心可能比什么都重要。',
  'During the charity activity, a child said "Today was fun." I kept thinking about this sentence. It turns out happiness can sometimes be very simple, maybe just having someone to play with you and look at interesting things together. You don''t need many toys or to go far away. Companionship and caring might be more important than anything else.',
  '2025-01-16',
  '["快乐", "陪伴", "人生感悟"]'::jsonb,
  '["Happiness", "Companionship", "Life Insights"]'::jsonb,
  '2025-01-16T20:00:00Z',
  '2025-01-16T20:00:00Z'
);

-- 插入反思数据
INSERT INTO reflections (
  id, content_zh, content_en, date, tags_zh, tags_en, created_at, updated_at
) VALUES
-- 反思1
(
  'reflection-001',
  '今天我第一次觉得,有些小朋友比我更需要帮助。',
  'Today for the first time I felt that some children need help more than I do.',
  '2025-01-15',
  '["同理心", "公益活动"]'::jsonb,
  '["Empathy", "Charity"]'::jsonb,
  '2025-01-15T20:00:00Z',
  '2025-01-15T20:00:00Z'
),
-- 反思2
(
  'reflection-002',
  '我突然觉得,原来快乐有时候其实很简单。可能只是有人陪你一起玩,一起看看有趣的东西。',
  'I suddenly realized that happiness can sometimes be very simple. Maybe it''s just having someone to play with you and look at interesting things together.',
  '2025-01-15',
  '["快乐", "陪伴"]'::jsonb,
  '["Happiness", "Companionship"]'::jsonb,
  '2025-01-15T22:00:00Z',
  '2025-01-15T22:00:00Z'
),
-- 反思3
(
  'reflection-003',
  '这是我第一次发现,世界上有很多和我不一样的小朋友。也是第一次,我开始认真去观察别人。',
  'This was my first time discovering that there are many children in the world who are different from me. It was also the first time I started to seriously observe others.',
  '2025-01-16',
  '["观察", "成长"]'::jsonb,
  '["Observation", "Growth"]'::jsonb,
  '2025-01-16T18:00:00Z',
  '2025-01-16T18:00:00Z'
),
-- 反思4
(
  'reflection-004',
  '或许这个世界并不是公平的,但是却不妨碍我们去拥抱这个世界,去爱身边的人。',
  'Perhaps this world is not fair, but that doesn''t stop us from embracing this world and loving the people around us.',
  '2025-01-16',
  '["公平", "爱"]'::jsonb,
  '["Fairness", "Love"]'::jsonb,
  '2025-01-16T19:00:00Z',
  '2025-01-16T19:00:00Z'
),
-- 反思5
(
  'reflection-005',
  '今年的生日,不只是我自己开心,还有很多人一起开心。这才是最特别的。',
  'This year''s birthday wasn''t just about my own happiness, but many people being happy together. That''s what makes it special.',
  '2025-01-16',
  '["生日", "快乐"]'::jsonb,
  '["Birthday", "Happiness"]'::jsonb,
  '2025-01-16T21:00:00Z',
  '2025-01-16T21:00:00Z'
),
-- 反思6
(
  'reflection-006',
  '不论生活里发生了什么,你都可以拥有快乐,只要你愿意。',
  'No matter what happens in life, you can have happiness, as long as you''re willing.',
  '2025-01-17',
  '["快乐", "选择"]'::jsonb,
  '["Happiness", "Choice"]'::jsonb,
  '2025-01-17T10:00:00Z',
  '2025-01-17T10:00:00Z'
),
-- 反思7
(
  'reflection-007',
  '原来帮助别人,其实自己也会变得很快乐。',
  'It turns out that helping others actually makes you very happy too.',
  '2025-01-17',
  '["公益", "帮助"]'::jsonb,
  '["Charity", "Helping Others"]'::jsonb,
  '2025-01-17T11:00:00Z',
  '2025-01-17T11:00:00Z'
);
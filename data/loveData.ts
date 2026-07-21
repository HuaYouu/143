import type { MilestoneDefinition } from '../services/milestoneService';

export const relationshipStartDate = '2025-03-14T00:00:00';

export const milestoneDefinitions: MilestoneDefinition[] = [
  {
    days: 0,
    title: 'Ngày bắt đầu',
    description: 'Khoảnh khắc định mệnh của chúng ta',
    focusTitle: 'Ngày mình bắt đầu',
    waitMessage: 'Mình giữ lại giây phút đầu tiên ở đây.',
    reachedMessage: 'Từ hôm nay, câu chuyện của mình có một ngày để nhớ.',
  },
  {
    days: 30,
    title: '1 tháng',
    description: 'Tháng đầu tiên trọn vẹn',
    focusTitle: '1 tháng bên nhau',
    waitMessage: 'Một tháng đầu tiên đang tới rất gần.',
    reachedMessage: 'Mình đã đi qua tháng đầu tiên cùng nhau.',
  },
  {
    days: 100,
    title: '100 ngày',
    description: 'Kỷ niệm 100 ngày bên nhau',
    focusTitle: '100 ngày',
    waitMessage: 'Cùng chờ khoảnh khắc 100 ngày của tụi mình.',
    reachedMessage: '100 ngày đã nằm gọn trong tim mình rồi.',
  },
  {
    days: 143,
    title: '143 ngày',
    description: 'Một con số nhỏ, một lời thương rất riêng',
    focusTitle: '143 ngày',
    waitMessage: '143 đang tới, như một câu "I love you" được giấu kỹ.',
    reachedMessage: '143 ngày, và vẫn muốn thương nhiều hơn nữa.',
  },
  {
    days: 365,
    title: '1 năm',
    description: '365 ngày của yêu thương',
    focusTitle: '1 năm',
    waitMessage: 'Đêm trước một năm chắc sẽ rất đáng nhớ.',
    reachedMessage: 'Một năm đã qua, mình vẫn ở đây cùng nhau.',
  },
  {
    days: 500,
    title: '500 ngày',
    description: '500 cảm giác cứ như ngày đầu',
    focusTitle: '500 ngày',
    waitMessage: 'Tối nay mình cùng đợi 500 ngày nha.',
    reachedMessage: 'Mình đã chạm mốc 500 ngày rồi.',
  },
  {
    days: 730,
    title: '2 năm',
    description: 'Hai năm, hai người, một hành trình dài hơn',
    focusTitle: '2 năm',
    waitMessage: 'Cùng chờ thêm một vòng mùa nữa của tụi mình.',
    reachedMessage: 'Hai năm rồi, nghe vẫn dịu dàng như mới hôm qua.',
  },
  {
    days: 1000,
    title: '1000 ngày',
    description: 'Một hành trình dài tuyệt đẹp',
    focusTitle: '1000 ngày',
    waitMessage: '1000 ngày đang ở phía trước, mình cùng đợi nhé.',
    reachedMessage: '1000 ngày đã thành một phần rất đẹp của tụi mình.',
  },
  {
    days: 1430,
    title: '1430 ngày',
    description: 'Một phiên bản lớn hơn của lời thương 143',
    focusTitle: '1430 ngày',
    waitMessage: 'Lại một mốc 143 nữa, chỉ là mình đã đi xa hơn.',
    reachedMessage: '1430 ngày, lời thương đã có thêm rất nhiều ký ức.',
  },
];

export interface MilestoneLetter {
  milestoneDays: number;
  title: string;
  preview: string;
  body: string;
}

export const milestoneLetters: MilestoneLetter[] = [
  {
    milestoneDays: 143,
    title: 'Lá thư 143',
    preview: 'Một lời thương nhỏ được giấu lại cho ngày 143.',
    body: 'Nếu 143 là một cách nói yêu rất ngắn, thì anh muốn để nó dài ra bằng từng ngày mình đã ở cạnh nhau. Cảm ơn em vì đã làm những ngày bình thường có thêm một nơi để nhớ.',
  },
  {
    milestoneDays: 365,
    title: 'Lá thư 1 năm',
    preview: 'Dành cho ngày mình đi qua một vòng mùa cùng nhau.',
    body: 'Một năm không chỉ là 365 ngày. Nó là những lần chờ nhau, thương nhau, giận rồi lại mềm lòng, và vẫn chọn ở lại. Nếu được quay lại, anh vẫn muốn bắt đầu từ ngày 14 tháng 03 ấy.',
  },
  {
    milestoneDays: 500,
    title: 'Lá thư 500 ngày',
    preview: 'Mở khi tụi mình chạm mốc 500 ngày.',
    body: '500 ngày nghe như một con số lớn, nhưng ở cạnh em thì nó vẫn giống một điều đang bắt đầu. Anh thích cảm giác mình có thêm một cột mốc để cùng ngồi chờ, rồi cùng cười khi đồng hồ chuyển ngày.',
  },
  {
    milestoneDays: 1000,
    title: 'Lá thư 1000 ngày',
    preview: 'Một lá thư cho một hành trình rất dài và rất đẹp.',
    body: 'Nếu mình đã tới được 1000 ngày, anh mong trong đó có thật nhiều tối yên bình, thật nhiều câu chuyện nhỏ, và thật nhiều lần mình nhìn nhau như thể mọi thứ ngoài kia có thể chậm lại một chút.',
  },
];

export const focusMusic = {
  title: 'Nhạc nền chờ mốc',
  description: 'Một lớp âm thanh rất nhẹ, chỉ bật khi bạn bấm nút.',
};


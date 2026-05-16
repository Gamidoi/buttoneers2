import { getChallenges } from 'backend/challenges.jsw';

$w.onReady(async function () {
  const challenges = await getChallenges();

  if (challenges.length === 0) {
    $w('#repeater1').hide();
    return;
  }

  $w('#repeater1').data = challenges.map(c => ({ _id: c._id, ...c }));

  $w('#repeater1').onItemReady(($item, itemData) => {
    $item('#ChallengeTitle').text = itemData.title || '';
    $item('#ChallengeBody').text = itemData.content || '';
    $item('#ChllengeMonth').text = itemData.month || '';

    if (itemData.imageUrl) {
      $item('#ChallengeImage').src = itemData.imageUrl;
      $item('#ChallengeImage').show();
    } else {
      $item('#ChallengeImage').hide();
    }
  });
});

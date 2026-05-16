import { getApprovedPosts } from 'backend/communityPosts.jsw';

  $w.onReady(async function () {
    $w('#noPostsText').hide();

    const posts = await getApprovedPosts();
    if (posts.length === 0) {
      $w('#noPostsText').show();
      $w('#postRepeater').hide();
      return;
    } 
    $w('#postRepeater').data = posts;
    $w('#postRepeater').onItemReady(($item, itemData) => {
      $item('#titleText').text = itemData.title;
      $item('#contentText').text = itemData.content;
      $item('#authorText').text = 'By ' + itemData.authorName;
      if (itemData.imageUrl) {
        $item('#postImage').src = itemData.imageUrl;
        $item('#postImage').fitMode = 'fit';
        $item('#postImage').show();
      } else {
        $item('#postImage').hide();
      }
    });
  });

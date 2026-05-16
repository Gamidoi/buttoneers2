import { getApprovedPosts } from 'backend/communityPosts.jsw';
import { currentMember } from 'wix-members';

  $w.onReady(async function () {
    const member = await currentMember.getMember().catch(() => null);
    if (member) {
      const roles = await currentMember.getRoles().catch(() => []);
      console.log('[Community Feed] Logged-in member:', member.loginEmail || member._id);
      console.log('[Community Feed] Roles:', JSON.stringify(roles));
    } else {
      console.log('[Community Feed] No member logged in');
    }
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
      $item('#authorText').text = 'By ' + (itemData.anonymous ? 'Anonymous' : itemData.authorName);
      if (itemData.imageUrl) {
        $item('#postImage').src = itemData.imageUrl;
        $item('#postImage').fitMode = 'fit';
        $item('#postImage').show();
      } else {
        $item('#postImage').hide();
      }
    });
  });

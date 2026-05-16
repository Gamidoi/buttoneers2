
  import { getPendingPosts, approvePost, rejectPost } from 'backend/communityPosts.jsw';
  import { currentMember } from 'wix-members';
  import wixLocation from 'wix-location';
  
  let posts = [];
  
  $w.onReady(async function () {
    $w('#postRepeater').hide();
    $w('#noPendingText').hide();
    
    const member = await currentMember.getMember();
    if (!member) { wixLocation.to('/'); return; }

    const roles = await currentMember.getRoles();
    if (!roles.some(r => r.title === 'Moderator') && !roles.some(r => r.title === 'Admin')) { wixLocation.to('/'); return; }

    posts = await getPendingPosts();
    if (posts.length === 0) { $w('#noPendingText').show(); return; }
	
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
      $item('#approveBtn').onClick(async () => {
        await approvePost(itemData._id); 
        posts = posts.filter(p => p._id !== itemData._id);
        $w('#postRepeater').data = posts;
        if (posts.length === 0) { $w('#postRepeater').hide(); $w('#noPendingText').show(); }
      });
      $item('#rejectBtn').onClick(async () => {
        await rejectPost(itemData._id); 
        posts = posts.filter(p => p._id !== itemData._id);
        $w('#postRepeater').data = posts;
        if (posts.length === 0) { $w('#postRepeater').hide(); $w('#noPendingText').show(); }
      });
    });
    $w('#postRepeater').show();
  });

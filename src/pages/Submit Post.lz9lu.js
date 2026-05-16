
  import { submitPost } from 'backend/communityPosts.jsw';
  import { currentMember } from 'wix-members';
  import wixWindow from 'wix-window';
  import wixLocation from 'wix-location';

  $w.onReady(async function () {
    $w('#statusMessage').hide();

    $w('#imageUpload').fileType = 'Image';
    $w('#imageUpload').buttonLabel = 'Add a Photo (optional)';

    const member = await currentMember.getMember();
    if (!member) {
      await wixWindow.openLightbox('Log In');
      const check = await currentMember.getMember();
      if (!check) { wixLocation.to('/'); return; }
    }

    $w('#submitBtn').onClick(async () => {
      const title = $w('#titleInput').value.trim();
      const content = $w('#contentInput').value.trim();
      if (!title || !content) {
        $w('#statusMessage').text = 'Please fill in both title and content.';
        $w('#statusMessage').show();
        return;
      }
      $w('#submitBtn').disable();
      $w('#statusMessage').hide();
      try {
        let imageUrl = null;
        if ($w('#imageUpload').value.length > 0) {
          const uploadResult = await $w('#imageUpload').startUpload();
          imageUrl = uploadResult.url;
        }
        await submitPost(title, content, imageUrl);
        $w('#titleInput').value = '';
        $w('#contentInput').value = '';
        $w('#imageUpload').reset();
        $w('#statusMessage').text = 'Post submitted successfully!';
        $w('#statusMessage').show();
      } catch (e) {
        $w('#statusMessage').text = 'Submission failed. Please try again.';
        $w('#statusMessage').show();
      } finally {
        $w('#submitBtn').enable();
      }
    });
  });

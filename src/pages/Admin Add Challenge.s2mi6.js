import { insertChallenge } from 'backend/challenges.jsw';
import { currentMember } from 'wix-members';
import wixLocation from 'wix-location';

$w.onReady(async function () {
  $w('#statusMessage').hide();

  $w('#UploadChallengeImage').fileType = 'Image';

  const member = await currentMember.getMember();
  if (!member) { wixLocation.to('/'); return; }

  const roles = await currentMember.getRoles();
  if (!roles.some(r => r.title === 'Admin') && !roles.some(r => r.title === 'Moderator')) {
    wixLocation.to('/');
    return;
  }

  $w('#SubmitNewChallengeButton').onClick(async () => {
    const month = $w('#ChallengeMonthInput').value.trim();
    const title = $w('#ChallengeTitleInput').value.trim();
    const content = $w('#ChallengeBodyInput').value.trim();

    if (!month || !title || !content) {
      $w('#statusMessage').text = 'Please fill in month, title, and content.';
      $w('#statusMessage').show();
      return;
    }

    $w('#SubmitNewChallengeButton').disable();
    $w('#statusMessage').hide();

    try {
      let imageUrl = null;
      const uploadButton = $w('#UploadChallengeImage');
      if (uploadButton.value.length > 0) {
        const uploadResult = await uploadButton.startUpload();
        imageUrl = uploadResult.url;
      }

      await insertChallenge(month, title, content, imageUrl);
      $w('#ChallengeTitleInput').value = '';
      $w('#ChallengeBodyInput').value = '';
      $w('#ChallengeMonthInput').value = '';
      $w('#UploadChallengeImage').reset();
      $w('#statusMessage').text = 'Challenge added successfully!';
      $w('#statusMessage').show();
    } catch (err) {
      console.log(err);
      $w('#statusMessage').text = 'Failed to add challenge. Please try again.';
      $w('#statusMessage').show();
    } finally {
      $w('#SubmitNewChallengeButton').enable();
    }
  });
});

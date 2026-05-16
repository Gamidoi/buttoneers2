import { currentMember } from 'wix-members';

function hideAdminTab() {
    const menu = $w('#horizontalMenu1');
    menu.menuItems = menu.menuItems.filter(item => item.label !== 'Admin');
}

$w.onReady(async function () {
    const member = await currentMember.getMember().catch(() => null);
    if (!member) {
        hideAdminTab();
        return;
    }

    const roles = await currentMember.getRoles().catch(() => []);
    const isAdmin = roles.some(r => r.title === 'Admin' || r.title === 'Moderator');
    if (!isAdmin) {
        hideAdminTab();
    }
});

import { currentMember } from 'wix-members';
import { currentUser } from 'wix-users';

function hideAdminTab() {
    const menu = $w('#horizontalMenu1');
    menu.menuItems = menu.menuItems.filter(item => !item.label?.toLowerCase().trim().startsWith('admin'));
}

$w.onReady(async function () {
    const member = await currentMember.getMember().catch(() => null);
    if (!member) {
        hideAdminTab();
        return;
    }

    const roles = await currentMember.getRoles().catch(() => []);
    const isAdmin = currentUser.role === 'Admin'
        || roles.some(r => r.title === 'Moderator')
        || roles.some(r => r.title === 'Admin');

    if (!isAdmin) {
        hideAdminTab();
    }
});

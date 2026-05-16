import { currentMember } from 'wix-members';

function hideAdminTab() {
    const menu = $w('#horizontalMenu1');
    console.log('menu items:', JSON.stringify(menu.menuItems));
    menu.menuItems = menu.menuItems.filter(item => !item.label?.toLowerCase().trim().startsWith('admin'));
}

$w.onReady(async function () {
    hideAdminTab();

    const member = await currentMember.getMember().catch(() => null);
    if (!member) return;

    const roles = await currentMember.getRoles().catch(() => []);
    const adminTitles = ['admin', 'moderator', 'owner', 'co-owner'];
    const isAdmin = roles.some(r => adminTitles.includes(r.title?.toLowerCase().trim()));
    if (isAdmin) {
        const menu = $w('#horizontalMenu1');
        menu.menuItems = [...menu.menuItems, { label: 'Admin', link: '/admin-review' }];
    }
});

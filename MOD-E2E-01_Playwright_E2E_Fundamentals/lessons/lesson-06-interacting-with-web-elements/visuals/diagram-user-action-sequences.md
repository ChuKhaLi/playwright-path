# User Action Sequences Visual Guide

## 🎬 Step-by-Step User Interaction Flows

This guide visualizes complex user interaction sequences, showing how multiple actions combine to create realistic user workflows in E2E testing.

---

## 🛍️ E-commerce Shopping Flow

### Complete Shopping Journey

```
┌─────────────────────────────────────────────────────────────┐
│                🛍️ COMPLETE SHOPPING SEQUENCE               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  👤 USER: Browse and Search                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Navigate to homepage                             │   │
│  │    await page.goto('/');                            │   │
│  │    ↓                                                │   │
│  │ 2. Search for product                               │   │
│  │    await page.getByPlaceholder('Search products')   │   │
│  │      .fill('wireless headphones');                  │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Search' }).click();                   │   │
│  │    ↓                                                │   │
│  │ 3. Filter results                                   │   │
│  │    await page.getByLabel('Price Range')             │   │
│  │      .selectOption('$50-$100');                     │   │
│  │    await page.getByLabel('Brand')                   │   │
│  │      .selectOption('Sony');                         │   │
│  │    ↓                                                │   │
│  │ 4. Sort by rating                                   │   │
│  │    await page.getByLabel('Sort by')                 │   │
│  │      .selectOption('rating-desc');                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  🔍 USER: Product Selection                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 5. View product details                             │   │
│  │    await page.getByText('Sony WH-1000XM4')          │   │
│  │      .click();                                      │   │
│  │    ↓                                                │   │
│  │ 6. Check product images                             │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Next Image' }).click();               │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Previous Image' }).click();           │   │
│  │    ↓                                                │   │
│  │ 7. Read reviews                                     │   │
│  │    await page.getByText('Customer Reviews')         │   │
│  │      .scrollIntoViewIfNeeded();                     │   │
│  │    await page.getByText('Show more reviews')        │   │
│  │      .click();                                      │   │
│  │    ↓                                                │   │
│  │ 8. Select product options                           │   │
│  │    await page.getByLabel('Color')                   │   │
│  │      .selectOption('Black');                        │   │
│  │    await page.getByLabel('Warranty')                │   │
│  │      .selectOption('2-year');                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  🛒 USER: Add to Cart                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 9. Add to cart                                      │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Add to Cart' }).click();              │   │
│  │    ↓                                                │   │
│  │ 10. Verify cart notification                        │   │
│  │     await expect(page.getByText('Added to cart'))   │   │
│  │       .toBeVisible();                               │   │
│  │     ↓                                               │   │
│  │ 11. Continue shopping                               │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Continue Shopping' }).click();       │   │
│  │     ↓                                               │   │
│  │ 12. Add second item                                 │   │
│  │     await page.getByPlaceholder('Search')           │   │
│  │       .fill('phone case');                          │   │
│  │     await page.press('body', 'Enter');              │   │
│  │     await page.getByText('iPhone 14 Case')          │   │
│  │       .click();                                     │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Add to Cart' }).click();             │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  💳 USER: Checkout Process                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 13. Go to cart                                      │   │
│  │     await page.getByRole('link',                    │   │
│  │       { name: 'Cart (2)' }).click();                │   │
│  │     ↓                                               │   │
│  │ 14. Review cart items                               │   │
│  │     await expect(page.getByText('Sony WH-1000XM4')) │   │
│  │       .toBeVisible();                               │   │
│  │     await expect(page.getByText('iPhone 14 Case'))  │   │
│  │       .toBeVisible();                               │   │
│  │     ↓                                               │   │
│  │ 15. Apply coupon                                    │   │
│  │     await page.getByLabel('Coupon Code')            │   │
│  │       .fill('SAVE10');                              │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Apply' }).click();                   │   │
│  │     ↓                                               │   │
│  │ 16. Proceed to checkout                             │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Checkout' }).click();                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Social Media Interaction Flow

### Complete Social Media Engagement

```
┌─────────────────────────────────────────────────────────────┐
│               📱 SOCIAL MEDIA INTERACTION FLOW              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔐 USER: Login and Setup                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Navigate and login                               │   │
│  │    await page.goto('/login');                       │   │
│  │    await page.getByLabel('Username')                │   │
│  │      .fill('testuser');                             │   │
│  │    await page.getByLabel('Password')                │   │
│  │      .fill('password123');                          │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Login' }).click();                    │   │
│  │    ↓                                                │   │
│  │ 2. Verify dashboard                                 │   │
│  │    await expect(page.getByText('Welcome back'))     │   │
│  │      .toBeVisible();                                │   │
│  │    ↓                                                │   │
│  │ 3. Check notifications                              │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Notifications' }).click();            │   │
│  │    const notificationCount = await page             │   │
│  │      .getByTestId('notification-count')             │   │
│  │      .textContent();                                │   │
│  │    console.log(`${notificationCount} notifications`);│   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  📝 USER: Create Post                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 4. Start new post                                   │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Create Post' }).click();              │   │
│  │    ↓                                                │   │
│  │ 5. Add post content                                 │   │
│  │    await page.getByPlaceholder('What\'s on your mind?')│ │
│  │      .fill('Just finished an amazing workout! 💪'); │   │
│  │    ↓                                                │   │
│  │ 6. Add image                                        │   │
│  │    await page.getByLabel('Add Photo')               │   │
│  │      .setInputFiles('workout-photo.jpg');           │   │
│  │    ↓                                                │   │
│  │ 7. Add location                                     │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Add Location' }).click();             │   │
│  │    await page.getByPlaceholder('Search location')   │   │
│  │      .fill('Central Park');                         │   │
│  │    await page.getByText('Central Park, NY')         │   │
│  │      .click();                                      │   │
│  │    ↓                                                │   │
│  │ 8. Set privacy                                      │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Privacy Settings' }).click();         │   │
│  │    await page.getByLabel('Friends Only').check();   │   │
│  │    ↓                                                │   │
│  │ 9. Publish post                                     │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Post' }).click();                     │   │
│  │    await expect(page.getByText('Post published'))   │   │
│  │      .toBeVisible();                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  👥 USER: Social Interactions                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 10. Browse feed                                     │   │
│  │     await page.getByRole('link',                    │   │
│  │       { name: 'Home Feed' }).click();               │   │
│  │     ↓                                               │   │
│  │ 11. Interact with posts                             │   │
│  │     // Like first post                              │   │
│  │     await page.locator('.post').first()             │   │
│  │       .getByRole('button', { name: 'Like' })        │   │
│  │       .click();                                     │   │
│  │     ↓                                               │   │
│  │ 12. Comment on post                                 │   │
│  │     await page.locator('.post').first()             │   │
│  │       .getByRole('button', { name: 'Comment' })     │   │
│  │       .click();                                     │   │
│  │     await page.getByPlaceholder('Write a comment')  │   │
│  │       .fill('Great post! Thanks for sharing.');     │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Post Comment' }).click();            │   │
│  │     ↓                                               │   │
│  │ 13. Share post                                      │   │
│  │     await page.locator('.post')                     │   │
│  │       .filter({ hasText: 'workout motivation' })    │   │
│  │       .getByRole('button', { name: 'Share' })       │   │
│  │       .click();                                     │   │
│  │     await page.getByText('Share to Timeline')       │   │
│  │       .click();                                     │   │
│  │     await page.getByPlaceholder('Add your thoughts')│   │
│  │       .fill('Motivation for everyone!');            │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Share' }).click();                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  🔍 USER: Explore and Connect                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 14. Search for friends                              │   │
│  │     await page.getByPlaceholder('Search people')    │   │
│  │       .fill('John Smith');                          │   │
│  │     await page.press('body', 'Enter');              │   │
│  │     ↓                                               │   │
│  │ 15. Send friend request                             │   │
│  │     await page.getByText('John Smith')              │   │
│  │       .locator('..')                                │   │
│  │       .getByRole('button', { name: 'Add Friend' })  │   │
│  │       .click();                                     │   │
│  │     ↓                                               │   │
│  │ 16. Join group                                      │   │
│  │     await page.getByRole('link',                    │   │
│  │       { name: 'Groups' }).click();                  │   │
│  │     await page.getByText('Fitness Enthusiasts')     │   │
│  │       .click();                                     │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Join Group' }).click();              │   │
│  │     ↓                                               │   │
│  │ 17. Update profile                                  │   │
│  │     await page.getByRole('link',                    │   │
│  │       { name: 'Profile' }).click();                 │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Edit Profile' }).click();            │   │
│  │     await page.getByLabel('Bio')                    │   │
│  │       .fill('Fitness enthusiast and tech lover');   │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Save Changes' }).click();            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📧 Email Management Flow

### Complete Email Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                📧 EMAIL MANAGEMENT SEQUENCE                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📥 USER: Inbox Management                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Access inbox                                     │   │
│  │    await page.goto('/mail/inbox');                  │   │
│  │    await expect(page.getByText('Inbox'))            │   │
│  │      .toBeVisible();                                │   │
│  │    ↓                                                │   │
│  │ 2. Check unread count                               │   │
│  │    const unreadCount = await page                   │   │
│  │      .getByTestId('unread-count').textContent();    │   │
│  │    console.log(`${unreadCount} unread emails`);     │   │
│  │    ↓                                                │   │
│  │ 3. Sort emails                                      │   │
│  │    await page.getByLabel('Sort by')                 │   │
│  │      .selectOption('date-desc');                    │   │
│  │    ↓                                                │   │
│  │ 4. Filter emails                                    │   │
│  │    await page.getByLabel('Show')                    │   │
│  │      .selectOption('unread');                       │   │
│  │    ↓                                                │   │
│  │ 5. Select multiple emails                           │   │
│  │    await page.getByRole('checkbox',                 │   │
│  │      { name: 'Select all' }).check();               │   │
│  │    await page.getByRole('checkbox',                 │   │
│  │      { name: 'Select all' }).uncheck();             │   │
│  │    // Select specific emails                        │   │
│  │    await page.locator('.email-row')                 │   │
│  │      .filter({ hasText: 'Important' })              │   │
│  │      .getByRole('checkbox').check();                │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  📖 USER: Read and Respond                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 6. Open email                                       │   │
│  │    await page.getByText('Meeting Reminder')         │   │
│  │      .click();                                      │   │
│  │    ↓                                                │   │
│  │ 7. Read email content                               │   │
│  │    await expect(page.getByText('Team meeting'))     │   │
│  │      .toBeVisible();                                │   │
│  │    ↓                                                │   │
│  │ 8. Mark as important                                │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Mark Important' }).click();           │   │
│  │    ↓                                                │   │
│  │ 9. Reply to email                                   │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Reply' }).click();                    │   │
│  │    await page.getByLabel('Message')                 │   │
│  │      .fill('Thanks for the reminder. I\'ll be there.');│ │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Send' }).click();                     │   │
│  │    ↓                                                │   │
│  │ 10. Forward email                                   │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Forward' }).click();                 │   │
│  │     await page.getByLabel('To')                     │   │
│  │       .fill('colleague@company.com');               │   │
│  │     await page.getByLabel('Message')                │   │
│  │       .fill('FYI - please join if available');      │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Send' }).click();                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ✍️ USER: Compose New Email                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 11. Start new email                                 │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Compose' }).click();                 │   │
│  │     ↓                                               │   │
│  │ 12. Add recipients                                  │   │
│  │     await page.getByLabel('To')                     │   │
│  │       .fill('team@company.com');                    │   │
│  │     await page.getByLabel('CC')                     │   │
│  │       .fill('manager@company.com');                 │   │
│  │     ↓                                               │   │
│  │ 13. Add subject and body                            │   │
│  │     await page.getByLabel('Subject')                │   │
│  │       .fill('Weekly Status Update');                │   │
│  │     await page.getByLabel('Message')                │   │
│  │       .fill('Hi team,\n\nHere\'s this week\'s update...');│ │
│  │     ↓                                               │   │
│  │ 14. Add attachment                                  │   │
│  │     await page.getByLabel('Attach File')            │   │
│  │       .setInputFiles('status-report.pdf');          │   │
│  │     ↓                                               │   │
│  │ 15. Format text                                     │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Bold' }).click();                    │   │
│  │     await page.getByLabel('Message')                │   │
│  │       .type('Important: ');                         │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Bold' }).click();                    │   │
│  │     ↓                                               │   │
│  │ 16. Schedule send                                   │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Schedule Send' }).click();           │   │
│  │     await page.getByLabel('Send Date')              │   │
│  │       .fill('2024-01-15');                          │   │
│  │     await page.getByLabel('Send Time')              │   │
│  │       .fill('09:00');                               │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Schedule' }).click();                │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  🗂️ USER: Organization                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 17. Create folder                                   │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'New Folder' }).click();              │   │
│  │     await page.getByLabel('Folder Name')            │   │
│  │       .fill('Project Alpha');                       │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Create' }).click();                  │   │
│  │     ↓                                               │   │
│  │ 18. Move emails to folder                           │   │
│  │     await page.locator('.email-row')                │   │
│  │       .filter({ hasText: 'Alpha' })                 │   │
│  │       .getByRole('checkbox').check();               │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Move to' }).click();                 │   │
│  │     await page.getByText('Project Alpha').click();  │   │
│  │     ↓                                               │   │
│  │ 19. Set up filters                                  │   │
│  │     await page.getByRole('link',                    │   │
│  │       { name: 'Settings' }).click();                │   │
│  │     await page.getByText('Filters').click();        │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'New Filter' }).click();              │   │
│  │     await page.getByLabel('From contains')          │   │
│  │       .fill('noreply@github.com');                  │   │
│  │     await page.getByLabel('Move to folder')         │   │
│  │       .selectOption('GitHub');                      │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Save Filter' }).click();             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎮 Gaming Platform Flow

### Complete Gaming Session

```
┌─────────────────────────────────────────────────────────────┐
│                🎮 GAMING PLATFORM SEQUENCE                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🎯 USER: Game Discovery                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Browse game library                              │   │
│  │    await page.goto('/games');                       │   │
│  │    await page.getByLabel('Category')                │   │
│  │      .selectOption('Action');                       │   │
│  │    ↓                                                │   │
│  │ 2. Filter by rating                                 │   │
│  │    await page.getByLabel('Minimum Rating')          │   │
│  │      .selectOption('4-stars');                      │   │
│  │    ↓                                                │   │
│  │ 3. Sort by popularity                               │   │
│  │    await page.getByLabel('Sort by')                 │   │
│  │      .selectOption('popularity');                   │   │
│  │    ↓                                                │   │
│  │ 4. View game details                                │   │
│  │    await page.getByText('Cyber Quest 2077')         │   │
│  │      .click();                                      │   │
│  │    ↓                                                │   │
│  │ 5. Watch trailer                                    │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Play Trailer' }).click();             │   │
│  │    await page.waitForTimeout(3000);                 │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Close' }).click();                    │   │
│  │    ↓                                                │   │
│  │ 6. Read reviews                                     │   │
│  │    await page.getByText('User Reviews')             │   │
│  │      .scrollIntoViewIfNeeded();                     │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Load More Reviews' }).click();        │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  💰 USER: Purchase Process                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 7. Add to wishlist                                  │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Add to Wishlist' }).click();          │   │
│  │    ↓                                                │   │
│  │ 8. Check for discounts                              │   │
│  │    const originalPrice = await page                 │   │
│  │      .getByTestId('original-price').textContent();  │   │
│  │    const salePrice = await page                     │   │
│  │      .getByTestId('sale-price').textContent();      │   │
│  │    ↓                                                │   │
│  │ 9. Add to cart                                      │   │
│  │    await page.getByRole('button',                   │   │
│  │      { name: 'Add to Cart' }).click();              │   │
│  │    ↓                                                │   │
│  │ 10. Proceed to checkout                             │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Checkout' }).click();                │   │
│  │     ↓                                               │   │
│  │ 11. Select payment method                           │   │
│  │     await page.getByLabel('Credit Card').check();   │   │
│  │     await page.getByLabel('Card Number')            │   │
│  │       .fill('4111111111111111');                    │   │
│  │     await page.getByLabel('Expiry')                 │   │
│  │       .fill('12/25');                               │   │
│  │     await page.getByLabel('CVV').fill('123');       │   │
│  │     ↓                                               │   │
│  │ 12. Complete purchase                               │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Complete Purchase' }).click();       │   │
│  │     await expect(page.getByText('Purchase Complete'))│   │
│  │       .toBeVisible();                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  🎮 USER: Gaming Session                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 13. Launch game                                     │   │
│  │     await page.getByRole('button',                  │   │
│  │       { name: 'Play Now' }).click();                │   │
│  │
# Deployment Guide - Florida Autism Services

This guide covers deploying the Florida Autism Services website to Hostinger or any static hosting provider.

## Pre-Deployment Checklist

- [ ] Database is populated with initial data (optional)
- [ ] Environment variables are documented
- [ ] Build completes successfully
- [ ] All pages load without errors
- [ ] Forms submit correctly
- [ ] Accessibility features work (dark mode, low sensory mode)
- [ ] SEO meta tags are correct

## Building for Production

1. **Install dependencies** (if not already done):
```bash
npm install
```

2. **Run the build**:
```bash
npm run build
```

3. **Verify the build**:
   - Check that the `dist` folder was created
   - All assets should be in `dist/assets`
   - `index.html` should be in the root of `dist`

## Deploying to Hostinger

### Method 1: File Manager (Recommended for beginners)

1. **Access Hostinger File Manager**:
   - Log in to your Hostinger account
   - Go to your hosting dashboard
   - Open File Manager

2. **Navigate to public_html**:
   - This is typically where your website files go
   - If you have an existing site, consider backing it up first

3. **Upload files**:
   - Delete existing files in `public_html` (or create a subdirectory)
   - Upload ALL files from the `dist` folder:
     - `index.html`
     - `assets/` folder (contains CSS and JS)
     - Any other files in `dist`

4. **Set permissions**:
   - Ensure files have proper read permissions (typically 644 for files, 755 for folders)

### Method 2: FTP/SFTP (Recommended for experienced users)

1. **Get FTP credentials** from Hostinger:
   - Hostname (usually `ftp.yourdomain.com`)
   - Username
   - Password
   - Port (21 for FTP, 22 for SFTP)

2. **Connect using an FTP client** (FileZilla, Cyberduck, etc.):
   - Enter credentials
   - Navigate to `public_html` on the remote server

3. **Upload files**:
   - Select all files in your local `dist` folder
   - Upload to the remote `public_html` directory

### Method 3: Git Deployment (Advanced)

If Hostinger supports Git deployment:

1. Initialize Git in your project
2. Push to a repository
3. Connect Hostinger to your repository
4. Configure build commands in Hostinger

## Environment Variables

**IMPORTANT**: Environment variables need to be configured in your hosting environment.

For Hostinger:
1. These are typically set in a `.env` file in your root directory
2. Or through the hosting control panel if available

Required variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: Since this is a static site, environment variables are baked into the build. If you change them, you must rebuild and redeploy.

## Domain Configuration

1. **Point your domain** to Hostinger's nameservers:
   - Typically: `ns1.dns-parking.com` and `ns2.dns-parking.com`
   - Or use the nameservers provided by Hostinger

2. **SSL Certificate**:
   - Enable SSL/HTTPS in Hostinger control panel
   - This is usually automatic with Let's Encrypt

3. **Update meta tags** (if domain changes):
   - Edit `index.html` to update the `og:url` meta tag
   - Rebuild and redeploy

## Post-Deployment Checklist

- [ ] Visit your website at your domain
- [ ] Test navigation between all pages
- [ ] Test search functionality
- [ ] Submit a test contact form
- [ ] Verify dark mode toggle works
- [ ] Verify low sensory mode toggle works
- [ ] Test on mobile devices
- [ ] Check browser console for errors
- [ ] Test with screen reader (optional but recommended)
- [ ] Verify SEO meta tags with browser dev tools

## Populating the Database

After deployment, you'll want to add real provider data:

### Option 1: Using Supabase Dashboard

1. Log in to Supabase
2. Go to the SQL Editor
3. Run the queries from `sample-data.sql` (or create your own)

### Option 2: Using the Website Forms

1. Use the "Submit Provider" form
2. Approve submissions through the Supabase dashboard (requires authentication)

### Option 3: Direct Database Insert

If you have authentication set up:
1. Connect to your Supabase database
2. Insert records directly into tables
3. Ensure `is_verified` is set to `true` for providers/churches
4. Ensure `published` is set to `true` for resources

## Troubleshooting

### Issue: "White screen" or "Page not found"

**Solution**:
- Ensure all files from `dist` were uploaded
- Check that `index.html` is in the root directory
- Verify file permissions

### Issue: Images or CSS not loading

**Solution**:
- Ensure the `assets` folder was uploaded completely
- Check file permissions
- Look for 404 errors in browser console

### Issue: Forms not submitting

**Solution**:
- Verify Supabase environment variables are correct
- Check browser console for errors
- Ensure Supabase RLS policies allow public inserts for contact/submission forms

### Issue: Data not loading

**Solution**:
- Check that database tables are populated
- Verify Supabase connection in browser console
- Ensure RLS policies allow public reads for verified/published records

## Updating the Site

To make changes after deployment:

1. Make code changes locally
2. Test thoroughly
3. Run `npm run build`
4. Upload new `dist` files to Hostinger
5. Clear browser cache to see changes

## Performance Optimization

For better performance:

1. **Enable gzip compression** in Hostinger
2. **Enable browser caching** via `.htaccess`:
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
</IfModule>
```

3. **Use a CDN** (optional, for larger traffic)

## Monitoring & Analytics

Consider adding:
- Google Analytics (add tracking code to `index.html`)
- Sentry for error tracking
- Uptime monitoring (UptimeRobot, Pingdom, etc.)

## Support

If you encounter issues:
1. Check Hostinger's knowledge base
2. Contact Hostinger support
3. Review browser console errors
4. Check Supabase logs

## Security Notes

- Never commit `.env` file to public repositories
- Keep Supabase keys secure
- Use RLS policies to protect sensitive data
- Regularly update dependencies for security patches

---

**Congratulations!** Your Florida Autism Services website should now be live and accessible to families across Florida.

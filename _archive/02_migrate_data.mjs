#!/usr/bin/env node

/**
 * Florida ASD Directory - Data Migration Script
 * Migrates existing Supabase data to new unified schema
 * 
 * MIGRATION PLAN:
 * - providers (4,656 rows) → resources (category: healthcare)
 * - churches (10 rows) → resources (category: faith_based)
 * - provider_submissions → submissions
 * - JSON files (services, insurances, scholarships) → resources
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase connection
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_KEY';

if (!SUPABASE_URL || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
  console.error('❌ Error: SUPABASE_URL not set');
  console.log('Set it in your environment:');
  console.log('  Windows: set SUPABASE_URL=your_url_here');
  console.log('  Unix: export SUPABASE_URL=your_url_here');
  process.exit(1);
}

if (!SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY === 'YOUR_SERVICE_KEY') {
  console.error('❌ Error: SUPABASE_SERVICE_KEY not set');
  console.log('Set it in your environment:');
  console.log('  Windows: set SUPABASE_SERVICE_KEY=your_key_here');
  console.log('  Unix: export SUPABASE_SERVICE_KEY=your_key_here');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// JSON file paths (Windows paths)
const JSON_PATHS = {
  services: 'C:\\Projects\\ASD-Directory\\src\\frontend\\src\\data\\resources\\services',
  insurances: 'C:\\Projects\\ASD-Directory\\src\\frontend\\src\\data\\resources\\insurances',
  scholarships: 'C:\\Projects\\ASD-Directory\\src\\frontend\\src\\data\\resources\\scholarships'
};

// Track statistics
const stats = {
  providers: { total: 0, migrated: 0, errors: 0 },
  churches: { total: 0, migrated: 0, errors: 0 },
  submissions: { total: 0, migrated: 0, errors: 0 },
  json: { total: 0, migrated: 0, errors: 0 }
};

/**
 * Migrate healthcare providers to resources table
 */
async function migrateProviders() {
  console.log('\n📋 Migrating Healthcare Providers...');
  
  try {
    // Fetch ALL providers using pagination (Supabase has 1000 record limit per request)
    let allProviders = [];
    let page = 0;
    const pageSize = 1000;
    let hasMore = true;
    
    console.log('   Fetching providers...');
    while (hasMore) {
      const { data: providers, error: fetchError } = await supabase
        .from('providers')
        .select('*')
        .range(page * pageSize, (page + 1) * pageSize - 1);
      
      if (fetchError) throw fetchError;
      
      if (providers && providers.length > 0) {
        allProviders = allProviders.concat(providers);
        console.log(`   Fetched page ${page + 1} (${providers.length} providers, total: ${allProviders.length})`);
        page++;
        hasMore = providers.length === pageSize; // Continue if we got a full page
      } else {
        hasMore = false;
      }
    }
    
    stats.providers.total = allProviders.length;
    console.log(`   Found ${allProviders.length} providers to migrate`);
    
    // Transform and insert in batches
    const batchSize = 100;
    for (let i = 0; i < allProviders.length; i += batchSize) {
      const batch = allProviders.slice(i, i + batchSize);
      
      const transformedBatch = batch.map(provider => ({
        name: provider.provider_name || provider.name,
        category: 'healthcare',
        subcategory: provider.service_type || 'Healthcare Provider',
        description: provider.description || null,
        
        // Address fields
        address: provider.address1 || provider.address,
        city: provider.city,
        county: provider.county,
        zip_code: provider.zip || provider.zip_code,
        latitude: provider.latitude,
        longitude: provider.longitude,
        
        // Contact info
        phone: provider.phone,
        email: provider.email,
        website: provider.website,
        hours: provider.hours,
        
        // Service information
        programs: provider.programs || [],
        accommodations: provider.accommodations || [],
        age_groups: provider.age_groups || [],
        
        // Metadata
        verified: provider.verified || false,
        last_verified_date: provider.last_updated,
        featured: false,
        
        // Google data (if available)
        google_place_id: provider.google_place_id,
        rating: provider.rating,
        user_ratings_total: provider.user_ratings_total,
        
        // Source tracking
        source: provider.source || 'legacy_migration',
        
        // Timestamps
        created_at: provider.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      const { error: insertError } = await supabase
        .from('resources')
        .insert(transformedBatch);
      
      if (insertError) {
        console.error(`   ❌ Error in batch ${i / batchSize + 1}:`, insertError.message);
        stats.providers.errors += batch.length;
      } else {
        stats.providers.migrated += batch.length;
        console.log(`   ✅ Migrated batch ${i / batchSize + 1}/${Math.ceil(allProviders.length / batchSize)} (${batch.length} providers)`);
      }
    }
    
    console.log(`   ✅ Providers migration complete: ${stats.providers.migrated}/${stats.providers.total} successful`);
    
  } catch (error) {
    console.error('   ❌ Error migrating providers:', error.message);
  }
}

/**
 * Migrate faith-based communities (churches) to resources table
 */
async function migrateChurches() {
  console.log('\n⛪ Migrating Faith-Based Communities...');
  
  try {
    // Fetch all churches
    const { data: churches, error: fetchError } = await supabase
      .from('churches')
      .select('*');
    
    if (fetchError) throw fetchError;
    
    stats.churches.total = churches.length;
    console.log(`   Found ${churches.length} churches to migrate`);
    
    const transformedChurches = churches.map(church => ({
      name: church.ChurchName || church.name,
      category: 'faith_based',
      subcategory: 'Church',
      denomination: church.Denomination,
      description: church.AccommodationSnippet || church.description,
      
      // Address fields
      address: church.Street || church.address,
      city: church.City || church.city,
      county: church.County || church.county,
      state: church.State || 'FL',
      zip_code: church.ZIP || church.zip_code,
      latitude: church.Lat || church.latitude,
      longitude: church.Lon || church.longitude,
      
      // Contact info
      phone: church.Phone || church.phone,
      email: church.ContactEmail || church.email,
      website: church.Website || church.website,
      
      // Programs and accommodations
      programs: [
        church.ChildrenProgram && 'Children\'s Program',
        church.AdultProgram && 'Adult Program',
      ].filter(Boolean),
      
      accommodations: [
        church.SensoryRoom && 'Sensory Room',
        church.AlternativeService && 'Alternative Service Times',
        ...(church.AccommodationTags || [])
      ].filter(Boolean),
      
      age_groups: ['all_ages'],
      
      // Metadata
      verified: church.verified !== false,
      last_verified_date: church.last_updated,
      featured: false,
      
      // Source tracking
      source: 'legacy_migration',
      
      // Timestamps
      created_at: church.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    const { error: insertError } = await supabase
      .from('resources')
      .insert(transformedChurches);
    
    if (insertError) {
      console.error('   ❌ Error inserting churches:', insertError.message);
      stats.churches.errors = churches.length;
    } else {
      stats.churches.migrated = churches.length;
      console.log(`   ✅ Churches migration complete: ${stats.churches.migrated}/${stats.churches.total} successful`);
    }
    
  } catch (error) {
    console.error('   ❌ Error migrating churches:', error.message);
  }
}

/**
 * Migrate provider submissions to new submissions table
 */
async function migrateSubmissions() {
  console.log('\n📝 Migrating Provider Submissions...');
  
  try {
    // Fetch all provider submissions
    const { data: oldSubmissions, error: fetchError } = await supabase
      .from('provider_submissions')
      .select('*');
    
    if (fetchError) {
      // Table doesn't exist - that's okay, just skip
      if (fetchError.message.includes('does not exist') || 
          fetchError.message.includes('not found') ||
          fetchError.message.includes('Could not find the table')) {
        console.log('   ⚠️  No provider_submissions table found - skipping');
        return;
      }
      throw fetchError;
    }
    
    if (!oldSubmissions || oldSubmissions.length === 0) {
      console.log('   ⚠️  No submissions to migrate');
      return;
    }
    
    stats.submissions.total = oldSubmissions.length;
    console.log(`   Found ${oldSubmissions.length} submissions to migrate`);
    
    const transformedSubmissions = oldSubmissions.map(submission => ({
      resource_name: submission.provider_name || submission.resource_name,
      category: submission.category || 'healthcare',
      description: submission.description,
      
      // Location
      address: submission.address,
      city: submission.city,
      
      // Contact
      phone: submission.phone,
      email: submission.email,
      website: submission.website,
      
      // Submitter info
      submitter_name: submission.submitter_name,
      submitter_email: submission.submitter_email,
      submitter_relationship: submission.submitter_relationship || submission.relationship,
      
      // Status
      status: submission.status || 'pending',
      notes: submission.notes || submission.admin_notes,
      
      // Timestamps
      created_at: submission.created_at || new Date().toISOString()
    }));
    
    const { error: insertError } = await supabase
      .from('submissions')
      .insert(transformedSubmissions);
    
    if (insertError) {
      console.error('   ❌ Error inserting submissions:', insertError.message);
      stats.submissions.errors = oldSubmissions.length;
    } else {
      stats.submissions.migrated = oldSubmissions.length;
      console.log(`   ✅ Submissions migration complete: ${stats.submissions.migrated}/${stats.submissions.total} successful`);
    }
    
  } catch (error) {
    console.error('   ❌ Error migrating submissions:', error.message);
  }
}

/**
 * Migrate JSON files to resources
 */
async function migrateJsonResources() {
  console.log('\n📄 Migrating JSON Resources...');
  
  const categoryMap = {
    services: { category: 'support_services', subcategory: 'Service Program' },
    insurances: { category: 'healthcare', subcategory: 'Insurance Provider' },
    scholarships: { category: 'education', subcategory: 'Scholarship Program' }
  };
  
  for (const [type, dirPath] of Object.entries(JSON_PATHS)) {
    console.log(`\n   Processing ${type}...`);
    
    try {
      // Check if directory exists
      if (!fs.existsSync(dirPath)) {
        console.log(`   ⚠️  Directory not found: ${dirPath}`);
        continue;
      }
      
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
      console.log(`   Found ${files.length} JSON files`);
      
      for (const file of files) {
        try {
          const filePath = path.join(dirPath, file);
          const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          
          // Handle both array and object formats
          const items = Array.isArray(content) ? content : [content];
          
          const transformedItems = items.map(item => ({
            name: item.name || item.title,
            category: categoryMap[type].category,
            subcategory: categoryMap[type].subcategory,
            description: item.description || item.details,
            
            // Contact info
            phone: item.phone,
            email: item.email,
            website: item.website || item.url,
            
            // Location
            city: item.city,
            county: item.county,
            
            // Additional data
            programs: item.programs || [],
            accommodations: item.accommodations || [],
            age_groups: item.age_groups || item.ages || ['all_ages'],
            
            // Metadata
            verified: true, // JSON files are pre-verified
            featured: false,
            source: `json_${type}`,
            
            // Timestamps
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })).filter(item => item.name); // Only include items with names
          
          if (transformedItems.length > 0) {
            const { error: insertError } = await supabase
              .from('resources')
              .insert(transformedItems);
            
            if (insertError) {
              console.error(`   ❌ Error inserting from ${file}:`, insertError.message);
              stats.json.errors += transformedItems.length;
            } else {
              stats.json.migrated += transformedItems.length;
              stats.json.total += transformedItems.length;
              console.log(`   ✅ Migrated ${transformedItems.length} items from ${file}`);
            }
          }
          
        } catch (error) {
          console.error(`   ❌ Error processing ${file}:`, error.message);
        }
      }
      
    } catch (error) {
      console.error(`   ❌ Error reading ${type} directory:`, error.message);
    }
  }
  
  console.log(`\n   ✅ JSON migration complete: ${stats.json.migrated}/${stats.json.total} successful`);
}

/**
 * Main migration function
 */
async function runMigration() {
  console.log('🚀 Starting Florida ASD Directory Data Migration\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const startTime = Date.now();
  
  // Run migrations sequentially
  await migrateProviders();
  await migrateChurches();
  await migrateSubmissions();
  await migrateJsonResources();
  
  // Print summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Migration Summary\n');
  console.log(`Healthcare Providers: ${stats.providers.migrated}/${stats.providers.total} (${stats.providers.errors} errors)`);
  console.log(`Faith Communities:    ${stats.churches.migrated}/${stats.churches.total} (${stats.churches.errors} errors)`);
  console.log(`Submissions:          ${stats.submissions.migrated}/${stats.submissions.total} (${stats.submissions.errors} errors)`);
  console.log(`JSON Resources:       ${stats.json.migrated}/${stats.json.total} (${stats.json.errors} errors)`);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const totalMigrated = stats.providers.migrated + stats.churches.migrated + 
                        stats.submissions.migrated + stats.json.migrated;
  const totalRecords = stats.providers.total + stats.churches.total + 
                       stats.submissions.total + stats.json.total;
  const totalErrors = stats.providers.errors + stats.churches.errors + 
                      stats.submissions.errors + stats.json.errors;
  
  console.log(`\n✅ Total: ${totalMigrated}/${totalRecords} records migrated successfully`);
  if (totalErrors > 0) {
    console.log(`⚠️  ${totalErrors} errors occurred during migration`);
  }
  console.log(`⏱️  Completed in ${duration} seconds\n`);
  
  if (totalMigrated === totalRecords && totalErrors === 0) {
    console.log('🎉 Migration completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Verify data in Supabase dashboard');
    console.log('2. Test Base44 frontend with migrated data');
    console.log('3. Update old pages to use new unified resources table');
  } else {
    console.log('⚠️  Migration completed with some issues. Please review errors above.\n');
  }
}

// Run the migration
runMigration().catch(error => {
  console.error('\n💥 Fatal error during migration:', error);
  process.exit(1);
});

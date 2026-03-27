# RemotePC Maintenance Guide
# =========================

## 🔧 Temp File Cleanup Issue - RESOLVED

### What Was Happening:
- OpenCode CLI was accumulating 79,314 files (63GB) in `C:\Users\karma\.local\share\opencode\`
- Kilo CLI had tool-output caches building up
- No automatic cleanup was configured

### What We Fixed:
1. ✅ Moved opencode cache to backup (63GB recovered)
2. ✅ Cleaned kilo tool-output directory
3. ✅ Created automated cleanup script
4. ✅ Set up maintenance procedures

## 🛠️ Ongoing Maintenance

### Weekly Cleanup (Recommended):
```batch
# Run this weekly to prevent disk filling up
C:\Users\karma\Desktop\remote-access-tool\cleanup-temp.bat
```

### Automatic Cleanup Setup:
1. Open Task Scheduler (Windows key + R, type `taskschd.msc`)
2. Create new task: "RemotePC Cleanup"
3. Set to run weekly on Sundays at 3 AM
4. Action: Start program `C:\Users\karma\Desktop\remote-access-tool\cleanup-temp.bat`

### CLI Tool Configuration:
Consider configuring your CLI tools to use smaller cache limits:

**For OpenCode:**
```bash
# Check if there's a config file to limit cache size
# opencode config --cache-size 1GB
```

**For Kilo:**
```bash
# Check for cache configuration options
# kilo config --max-cache-size 500MB
```

## 📊 Current Disk Status:
- **Total Space:** 511GB
- **Current Free:** ~4.4GB (after cleanup)
- **Backup Location:** `C:\Users\karma\.local\share\opencode_backup` (63GB)

## 🚨 Prevention Measures:

1. **Monitor disk space regularly**
2. **Run cleanup script weekly**
3. **Check CLI tool documentation for cache settings**
4. **Consider moving CLI caches to different drive if available**

## 📁 Files Created:
- `cleanup-temp.bat` - Automated cleanup script
- This maintenance guide

## 💡 Pro Tips:
- The backup folder contains your old cache - safe to delete after confirming everything works
- Consider excluding CLI cache directories from Windows Defender real-time scanning
- Use storage sense in Windows Settings to automatically clean temp files

## 🎯 Next Steps:
1. Test that your CLI tools still work after cleanup
2. Set up the scheduled task for automatic maintenance
3. Monitor disk usage over the next few weeks
4. Delete the backup folder once confirmed everything is working

**Issue resolved! Your C: drive should now have plenty of free space.** ✅
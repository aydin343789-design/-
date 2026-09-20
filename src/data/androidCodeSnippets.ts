export interface AndroidCodeFile {
  filename: string;
  packagePath: string;
  description: string;
  code: string;
  language: 'kotlin' | 'gradle';
}

export const ANDROID_PROJECT_FILES: AndroidCodeFile[] = [
  {
    filename: 'MainActivity.kt',
    packagePath: 'com.example.videocourse',
    description: 'نقطه ورود اصلی برنامه شامل NavHost، سیستم ناوبری Jetpack Compose و اسکافولد استاندارد Material 3.',
    language: 'kotlin',
    code: `package com.example.videocourse

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.*
import androidx.navigation.navArgument
import com.example.videocourse.ui.screens.*
import com.example.videocourse.ui.theme.VideoCourseTheme
import com.example.videocourse.viewmodel.CourseViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            VideoCourseTheme {
                val navController = rememberNavController()
                val viewModel: CourseViewModel = viewModel(
                    factory = CourseViewModel.provideFactory(applicationContext)
                )
                val watchedLessonIds by viewModel.watchedLessonIds.collectAsState()

                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = "categories",
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        // 1. Home Categories Screen
                        composable("categories") {
                            CategoryListScreen(
                                watchedLessonIds = watchedLessonIds,
                                onCategoryClick = { categoryName ->
                                    navController.navigate("lessons/$categoryName")
                                }
                            )
                        }

                        // 2. Category Lessons List Screen
                        composable(
                            route = "lessons/{categoryName}",
                            arguments = listOf(navArgument("categoryName") { type = NavType.StringType })
                        ) { backStackEntry ->
                            val categoryName = backStackEntry.arguments?.getString("categoryName") ?: ""
                            LessonListScreen(
                                categoryName = categoryName,
                                watchedLessonIds = watchedLessonIds,
                                onBackClick = { navController.popBackStack() },
                                onLessonClick = { lessonId ->
                                    navController.navigate("player/$lessonId")
                                },
                                onToggleWatched = { lessonId ->
                                    viewModel.toggleWatched(lessonId)
                                }
                            )
                        }

                        // 3. Video Player Screen with Media3 ExoPlayer
                        composable(
                            route = "player/{lessonId}",
                            arguments = listOf(navArgument("lessonId") { type = NavType.IntType })
                        ) { backStackEntry ->
                            val lessonId = backStackEntry.arguments?.getInt("lessonId") ?: 1
                            VideoPlayerScreen(
                                lessonId = lessonId,
                                isWatched = watchedLessonIds.contains(lessonId),
                                onBackClick = { navController.popBackStack() },
                                onToggleWatched = { viewModel.toggleWatched(lessonId) },
                                onNavigateToLesson = { nextId ->
                                    navController.navigate("player/$nextId") {
                                        popUpTo("player/$lessonId") { inclusive = true }
                                    }
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}`
  },
  {
    filename: 'VideoPlayerScreen.kt',
    packagePath: 'com.example.videocourse.ui.screens',
    description: 'صفحه کامپوز پلیر با قرار دادن AndroidView و Media3 ExoPlayer، کنترل‌های لمسی و ذخیره خودکار وضعیت تماشا.',
    language: 'kotlin',
    code: `package com.example.videocourse.ui.screens

import android.content.Context
import androidx.annotation.OptIn
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView
import com.example.videocourse.data.CourseRepository

@OptIn(UnstableApi::class)
@Composable
fun VideoPlayerScreen(
    lessonId: Int,
    isWatched: Boolean,
    onBackClick: () -> Unit,
    onToggleWatched: () -> Unit,
    onNavigateToLesson: (Int) -> Unit
) {
    val context = LocalContext.current
    val lesson = remember(lessonId) { CourseRepository.getLessonById(lessonId) } ?: return

    // Instantiate ExoPlayer lifecycle-safe
    val exoPlayer = remember(lessonId) {
        ExoPlayer.Builder(context).build().apply {
            setMediaItem(MediaItem.fromUri(lesson.videoUrl))
            prepare()
            playWhenReady = true
        }
    }

    // Auto-mark watched when video finishes
    DisposableEffect(exoPlayer) {
        val listener = object : Player.Listener {
            override fun onPlaybackStateChanged(playbackState: Int) {
                if (playbackState == Player.STATE_ENDED && !isWatched) {
                    onToggleWatched()
                }
            }
        }
        exoPlayer.addListener(listener)

        onDispose {
            exoPlayer.removeListener(listener)
            exoPlayer.release()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Native TopAppBar
        TopAppBar(
            title = { Text("Lesson #\${lesson.id}", style = MaterialTheme.typography.titleMedium) },
            navigationIcon = {
                IconButton(onClick = onBackClick) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                }
            },
            actions = {
                IconButton(onClick = onToggleWatched) {
                    Icon(
                        imageVector = if (isWatched) Icons.Filled.CheckCircle else Icons.Outlined.CheckCircle,
                        contentDescription = "Toggle Watched",
                        tint = if (isWatched) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline
                    )
                }
            }
        )

        // Media3 ExoPlayer AndroidView
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(16f / 9f)
                .background(MaterialTheme.colorScheme.surfaceVariant)
        ) {
            AndroidView(
                modifier = Modifier.fillMaxSize(),
                factory = { ctx ->
                    PlayerView(ctx).apply {
                        player = exoPlayer
                        useController = true
                    }
                },
                update = { view ->
                    view.player = exoPlayer
                }
            )
        }

        // Lesson Metadata and Description
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            Surface(
                shape = MaterialTheme.shapes.small,
                color = MaterialTheme.colorScheme.secondaryContainer,
                modifier = Modifier.padding(bottom = 8.dp)
            ) {
                Text(
                    text = lesson.category,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSecondaryContainer
                )
            }

            Text(
                text = lesson.title,
                style = MaterialTheme.typography.headlineSmall,
                color = MaterialTheme.colorScheme.onBackground
            )

            Text(
                text = "Duration: \${lesson.duration}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 4.dp, bottom = 12.dp)
            )

            HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

            Text(
                text = "Overview",
                style = MaterialTheme.typography.titleMedium,
                modifier = Modifier.padding(bottom = 4.dp)
            )

            Text(
                text = lesson.description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Navigation Previous / Next
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                OutlinedButton(
                    onClick = { onNavigateToLesson(lessonId - 1) },
                    enabled = lessonId > 1
                ) {
                    Text("Previous")
                }

                Button(
                    onClick = { onNavigateToLesson(lessonId + 1) },
                    enabled = lessonId < 120
                ) {
                    Text("Next Lesson")
                }
            }
        }
    }
}`
  },
  {
    filename: 'CourseDatabase.kt',
    packagePath: 'com.example.videocourse.data.db',
    description: 'تنظیمات پایگاه‌داده محلی SQLite Room برای ذخیره دائم تاریخچه دروس مشاهده شده در گوشی کاربر.',
    language: 'kotlin',
    code: `package com.example.videocourse.data.db

import android.content.Context
import androidx.room.*
import kotlinx.coroutines.flow.Flow

// 1. Room Entity
@Entity(tableName = "watched_lessons")
data class WatchedLessonEntity(
    @PrimaryKey val lessonId: Int,
    val watchedTimestamp: Long = System.currentTimeMillis()
)

// 2. Room Data Access Object (DAO)
@Dao
interface WatchedLessonDao {
    @Query("SELECT lessonId FROM watched_lessons")
    fun getAllWatchedLessonIds(): Flow<List<Int>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWatched(entity: WatchedLessonEntity)

    @Query("DELETE FROM watched_lessons WHERE lessonId = :id")
    suspend fun deleteWatched(id: Int)

    @Query("DELETE FROM watched_lessons")
    suspend fun clearAll()
}

// 3. Room Database
@Database(entities = [WatchedLessonEntity::class], version = 1, exportSchema = false)
abstract class CourseDatabase : RoomDatabase() {
    abstract fun watchedLessonDao(): WatchedLessonDao

    companion object {
        @Volatile
        private var INSTANCE: CourseDatabase? = null

        fun getDatabase(context: Context): CourseDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    CourseDatabase::class.java,
                    "video_course_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
`
  },
  {
    filename: 'CourseViewModel.kt',
    packagePath: 'com.example.videocourse.viewmodel',
    description: 'کلاس ویومدل ارائه دهنده وضعیت واکنشی StateFlow و عملیات ناهمگام دیتابیس با کورتین‌ها.',
    language: 'kotlin',
    code: `package com.example.videocourse.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.videocourse.data.CourseRepository
import com.example.videocourse.data.db.CourseDatabase
import com.example.videocourse.data.db.WatchedLessonEntity
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class CourseViewModel(private val database: CourseDatabase) : ViewModel() {
    private val dao = database.watchedLessonDao()

    val watchedLessonIds: StateFlow<Set<Int>> = dao.getAllWatchedLessonIds()
        .let { flow ->
            kotlinx.coroutines.flow.map { list -> list.toSet() }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptySet()
        )

    fun toggleWatched(lessonId: Int) {
        viewModelScope.launch {
            val isCurrentlyWatched = watchedLessonIds.value.contains(lessonId)
            if (isCurrentlyWatched) {
                dao.deleteWatched(lessonId)
            } else {
                dao.insertWatched(WatchedLessonEntity(lessonId = lessonId))
            }
        }
    }

    companion object {
        fun provideFactory(context: Context): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    val db = CourseDatabase.getDatabase(context)
                    return CourseViewModel(db) as T
                }
            }
    }
}
`
  },
  {
    filename: 'build.gradle.kts',
    packagePath: 'app',
    description: 'تنظیمات گریدل شامل وابستگی‌های رسمی Media3 ExoPlayer، کامپوز متریال ۳ و دیتابیس Room.',
    language: 'gradle',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.ksp)
}

android {
    namespace = "com.example.videocourse"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.videocourse"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.lifecycle.viewmodel.compose)

    // AndroidX Media3 ExoPlayer
    implementation("androidx.media3:media3-exoplayer:1.5.1")
    implementation("androidx.media3:media3-ui:1.5.1")
    implementation("androidx.media3:media3-common:1.5.1")

    // Room Database with Coroutines & KSP
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    ksp("androidx.room:room-compiler:2.6.1")
}`
  }
];

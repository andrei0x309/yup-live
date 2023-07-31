package gf.info.yup;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;

public class ExpoFirebaseMessagingService extends FirebaseMessagingService {

    int notificationId = 1;
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "default";
            String description = "";
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel channel = new NotificationChannel("default", name, importance);
            channel.setDescription(description);
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        this.createNotificationChannel();
    }

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);
        Log.i("gf.info.yup", token);

    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        Map<String, String> rm = remoteMessage.getData();
        if (rm.containsKey("title") && rm.containsKey("message")) {
            Bitmap bitmap = BitmapFactory.decodeResource(getResources(),R.drawable.in);

            Log.i("gf.info.yup", remoteMessage.getData().toString());
            NotificationCompat.Builder builder = new NotificationCompat.Builder(this, "default")
                    .setSmallIcon(R.drawable.in)
                    .setLargeIcon(bitmap)
                    .setContentTitle(rm.get("title"))
                    .setContentText(rm.get("message"))
                    .setStyle(new NotificationCompat.BigTextStyle()
                            .bigText(rm.get("message")))
                    .setPriority(NotificationCompat.PRIORITY_MAX);

            NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);

// notificationId is a unique int for each notification that you must define
            if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                // TODO: Consider calling
                //    ActivityCompat#requestPermissions
                // here to request the missing permissions, and then overriding
                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                //                                          int[] grantResults)
                // to handle the case where the user grants the permission. See the documentation
                // for ActivityCompat#requestPermissions for more details.
                return;
            }

            Intent intent = new Intent(this, MainActivity.class); // Replace YourMainActivity with the appropriate class for your app's main activity
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
            builder.setContentIntent(pendingIntent)
                    .setAutoCancel(true);

            notificationId++;
            notificationManager.notify(notificationId, builder.build());
        }
    }
}
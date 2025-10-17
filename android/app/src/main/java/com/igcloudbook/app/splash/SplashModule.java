package com.igcloudbook.app.splash;

import android.app.Activity;
import android.os.Handler;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import androidx.core.splashscreen.SplashScreen;

public class SplashModule extends ReactContextBaseJavaModule {
    private static boolean splashKeep = true;
    private static final int splashDELAY = 1500;

    private static final Runnable runner = () -> splashKeep = false;

    @ReactMethod
    public static void show(final Activity activity) {
        SplashScreen splashScreen = SplashScreen.installSplashScreen(activity);
        splashScreen.setKeepOnScreenCondition(() -> splashKeep);
        Handler handler = new Handler();
        handler.postDelayed(runner, splashDELAY);
    }

    SplashModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "SplashModule";
    }
}

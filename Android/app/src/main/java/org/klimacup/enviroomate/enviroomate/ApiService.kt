package org.klimacup.enviroomate.enviroomate

import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.AsyncTask
import android.os.IBinder
import com.android.volley.toolbox.Volley
import org.json.JSONObject
import java.net.URL

class ApiService : AsyncTask<URL, Integer, JSONObject>() {



    override fun onProgressUpdate(vararg values: Integer?) {
        super.onProgressUpdate(*values)
    }

    override fun onPostExecute(result: JSONObject?) {
        super.onPostExecute(result)
    }

    override fun doInBackground(vararg params: URL?): JSONObject {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun onCancelled(result: JSONObject?) {
        super.onCancelled(result)
    }

    override fun onCancelled() {
        super.onCancelled()
    }

    override fun onPreExecute() {
        super.onPreExecute()
    }
}
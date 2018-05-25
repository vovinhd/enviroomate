package org.klimacup.enviroomate.enviroomate;

import android.app.Application
import android.content.Context
import android.util.Log
import com.android.volley.Request
import com.android.volley.Request.Method.GET
import com.android.volley.Request.Method.POST
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.VolleyLog
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import org.json.JSONObject


class AppDelegate() : Application() {

    val TAG = "AppDelegate"

    // Singleton

    companion object {
        lateinit var instance: AppDelegate
            private set
    }

    //Api Paths
    val apiBaseUrl = "enviroommate.org:3000"
    val protocol = "http://"
    val loginPath = Pair("/api-login", POST);
    val profilePath = Pair("/api/profile", GET);
    val groupPath  = Pair("/api/wg", GET);
    val searchGroupPath  = Pair("/api/search-wg", POST);
    val createGroupPath  = Pair("/api/new-wg", POST);
    val updateGroupPath  = Pair("/api/update-wg", POST);
    val joinGroupPath  = Pair("/api/join-wg", POST);
    val follwedGroupPath = Pair("followed-wgs", GET);
    val follwGroupPath = Pair("follow-wg", POST);
    val currentChallengePath = Pair("/current-challenge", GET);

    //Volley
    lateinit var requestQueue :RequestQueue;

    fun login(username : String, password : String, callback: Response.Listener<JSONObject>) {
        var params = HashMap<String,String>()
        params["username"] = username;
        params["password"] = password;
        request(params, loginPath, callback);
    }

    fun getGroup(callback: Response.Listener<JSONObject>) {
        request(emptyMap(), groupPath, callback);
    }

    fun follwedGroupPath(callback: Response.Listener<JSONObject>) {
        request(emptyMap(), follwedGroupPath, callback);
    }

    fun getProfile(callback: Response.Listener<JSONObject>) {
        request(emptyMap(), profilePath, callback);
    }

    fun getCurrentChallenge(callback: Response.Listener<JSONObject>) {
        request(emptyMap(), currentChallengePath, callback);
    }

    fun createGroup(callback: Response.Listener<JSONObject>) {
        var params = HashMap<String,String>()
        request(params, createGroupPath, callback);
    }

    fun joinGroup(inviteLink: String, callback: Response.Listener<JSONObject>) {
        var params = HashMap<String,String>()
        params["inviteLink"] = inviteLink;
        request(params, joinGroupPath, callback);
    }

    fun updateGroup(newName: String, callback: Response.Listener<JSONObject>) {
        var params = HashMap<String,String>()
        params["newName"] = newName;
        request(params, updateGroupPath, callback);
    }

    fun followGroup(id: String, callback: Response.Listener<JSONObject>) {
        var params = HashMap<String,String>()
        params["id"] = id;
        request(params, follwGroupPath, callback);
    }

    fun searchGroup(query: String, callback: Response.Listener<JSONObject>) {
        var params = HashMap<String,String>()
        params["query"] = query;
        request(params, searchGroupPath, callback);
    }

    private fun request(params: Map<String, String>, url : Pair<String, Int>, callback: Response.Listener<JSONObject>) {
        var payload = JSONObject()
        params.forEach{ k, v -> payload.put(k, v)}
        val req = JsonObjectRequest(url.second, protocol + apiBaseUrl + url.first, payload, callback,
                Response.ErrorListener { response -> Log.e(TAG, response.toString()) }
        )
        addToRequestQueue(req)
    }

    override fun onCreate() {
        requestQueue = Volley.newRequestQueue(applicationContext);
        super.onCreate()
        instance = this;
    }

    fun <T : Any?> addToRequestQueue(req : Request<T>) {
        req.tag = TAG;
        VolleyLog.d("Added request to %s", req.url);
        requestQueue.add(req);
    }
}

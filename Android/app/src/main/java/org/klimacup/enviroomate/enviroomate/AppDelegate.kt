package org.klimacup.enviroomate.enviroomate

import android.app.Application
import android.content.SharedPreferences
import com.android.volley.Request
import com.android.volley.Request.Method.GET
import com.android.volley.Request.Method.POST
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.VolleyLog
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import org.json.JSONObject


class AppDelegate : Application() {

    private val TAG = "AppDelegate"

    // Singleton
    companion object {
        lateinit var instance: AppDelegate
            private set
    }

    //Api Paths
    private val apiBaseUrl = "enviroommate.org:3000"
    private val protocol = "http://"
    private val loginPath = Pair("/api-login", POST)
    private val profilePath = Pair("/api/profile", GET)
    private val groupPath  = Pair("/api/wg", GET)
    private val searchGroupPath  = Pair("/api/search-wg", POST)
    private val createGroupPath  = Pair("/api/new-wg", POST)
    private val updateGroupPath  = Pair("/api/update-wg", POST)
    private val joinGroupPath  = Pair("/api/join-wg", POST)
    private val follwedGroupPath = Pair("followed-wgs", GET)
    private val follwGroupPath = Pair("follow-wg", POST)
    private val currentChallengePath = Pair("/current-challenge", GET)

    //Volley
    private lateinit var requestQueue :RequestQueue

    private val tokenFilePath = "org.klimacup.enviroommate.token"
    private val USER_ID = "org.klimacup.enviroommate.token.id"
    private val TOKEN = "org.klimacup.enviroommate.token.token"

    private lateinit var tokenData: SharedPreferences

    fun login(username : String, password : String, callback: Response.Listener<JSONObject>, errorCallback: Response.ErrorListener) {
        val params = HashMap<String,String>()
        params["username"] = username
        params["password"] = password
        request(params, loginPath, Response.Listener { response ->
            val userid : Int = response.get("id") as Int
            val token = response.get("token") as String

            // save token
            tokenData.edit().putInt(USER_ID, userid).putString(TOKEN, token).apply();
            //call original cb to notify activity that the login succeeded
            callback.onResponse(response)
        }, errorCallback)
    }

    fun getGroup(callback: Response.Listener<JSONObject>, errorCallback: Response.ErrorListener) {
        request(emptyMap(), groupPath, callback, errorCallback)
    }

    fun follwedGroupPath(callback: Response.Listener<JSONObject>, errorCallback: Response.ErrorListener) {
        request(emptyMap(), follwedGroupPath, callback, errorCallback)
    }

    fun getProfile(callback: Response.Listener<JSONObject>, errorCallback: Response.ErrorListener) {
        request(emptyMap(), profilePath, callback, errorCallback)
    }

    fun getCurrentChallenge(callback: Response.Listener<JSONObject>, errorCallback: Response.ErrorListener) {
        request(emptyMap(), currentChallengePath, callback, errorCallback)
    }

    fun createGroup(callback: Response.Listener<JSONObject>, errorCallback: Response.ErrorListener) {
        val params = HashMap<String,String>()
        request(params, createGroupPath, callback, errorCallback)
    }

    fun joinGroup(inviteLink: String, callback: Response.Listener<JSONObject>, errorCallback: Response.ErrorListener) {
        val params = HashMap<String,String>()
        params["inviteLink"] = inviteLink
        request(params, joinGroupPath, callback, errorCallback)
    }

    fun updateGroup(newName: String, callback: Response.Listener<JSONObject>, errorCallback: Response.ErrorListener) {
        val params = HashMap<String,String>()
        params["newName"] = newName
        request(params, updateGroupPath, callback, errorCallback)
    }

    fun followGroup(id: String, callback: Response.Listener<JSONObject>, errorCallback: Response.ErrorListener) {
        val params = HashMap<String,String>()
        params["id"] = id
        request(params, follwGroupPath, callback, errorCallback)
    }

    fun searchGroup(query: String, callback: Response.Listener<JSONObject>, errorCallback: Response.ErrorListener) {
        val params = HashMap<String,String>()
        params["query"] = query
        request(params, searchGroupPath, callback, errorCallback)
    }

    private fun request(params: Map<String, String>, url : Pair<String, Int>, callback: Response.Listener<JSONObject>, errorCallback: Response.ErrorListener) {
        val payload = JSONObject()
        params.forEach{ k, v -> payload.put(k, v)}
        val req = JsonObjectRequest(url.second, protocol + apiBaseUrl + url.first, payload, callback, errorCallback)
        var token : String = tokenData.getString(TOKEN, "")
        if(token != "") {
            req.headers.put("Authorization", "Bearer $token")
        }
        addToRequestQueue(req)
    }


    override fun onCreate() {
        requestQueue = Volley.newRequestQueue(applicationContext)
        tokenData = getSharedPreferences(tokenFilePath, 0)
        super.onCreate()
        instance = this
    }

    private fun <T : Any?> addToRequestQueue(req : Request<T>) {
        req.tag = TAG
        VolleyLog.d("Added request to %s", req.url)
        requestQueue.add(req)
    }

    fun isLoggedIn() : Boolean {
        return tokenData.contains(TOKEN)
    }

    fun logout() {
        tokenData.edit().clear().apply()
    }
}

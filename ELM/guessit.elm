module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Events exposing (onClick)
import Http
import Json.Decode exposing (..)
import Json.Decode.Pipeline exposing (required)
import Html.Attributes exposing (placeholder,style)
import Html.Events exposing (onInput)
import Random

type alias Model
  = {liste : List String
    ,errmessage:String
    ,nb : Int
    ,dic :Dictionary
    ,win : Bool
  } 

type Msg = SendHttpRequest 
        | DataReceived (Result Http.Error (List Dictionary) ) 
        | WordsReceived (Result Http.Error String)
        | Change String
        | NewRandomNumber Int

--init
init : () -> (Model,Cmd Msg)
init _=({liste=[],nb=3,dic={word="",meanings=[]},win=False},getNicknames)

getWords : Cmd Msg
getWords =Http.get 
            {url ="http://localhost:8000/thousand_words_things_explainer.txt",
            expect = Http.expectString WordsReceived 
            }

getWord :  List String->Int->String
getWord liste nb= case  List.head  (List.drop nb liste) of
        Just y -> y
        Nothing -> ""

--update
update : Msg -> Model -> (Model,Cmd Msg)
update msg model =
    case msg of
        SendHttpRequest->
            (model,getNicknames)
        WordsReceived result->
            case result of 
                Ok nicknamesStr ->
                    let
                        nicknames =
                            String.split " " nicknamesStr
                        
                    in 
                       ({liste =nicknames,nb=model.nb,dic={word="",meanings=[]},win=False},Random.generate NewRandomNumber (Random.int 0 999))
                        
                        
                Err httpError ->
                    ({liste =model.liste,nb=model.nb,dic={word="",meanings=[]},win=False},Cmd.none)
        
        NewRandomNumber y ->let z=getWord model.liste y
                        in case z of 
                            ""->({liste =model.liste,worderr=Error "Couldn't find word",dicerr=Waiting ,nb=y,dic={word="",meanings=[]},win=False},Cmd.none)
                            _->({liste =model.liste,worderr=Done,dicerr=Loading ,nb=y,dic={word=z,meanings=[]},win=False},getDef z)


--view
view : Model -> Html Msg
view model =
    div []
        [h1 [] [text "Find the word"]
        ,viewDefsOrError model
        
        --,viewWords model
        ]

-- 辅助函数：将 Http.Error 转换为字符串
httpErrorToString : Http.Error -> String
httpErrorToString error =
    case error of
        Http.BadUrl msg ->
            "无效 URL: " ++ msg
        Http.Timeout ->
            "请求超时"
        Http.NetworkError ->
            "网络错误"
        Http.BadStatus statusCode ->
            "错误状态码: " ++ String.fromInt statusCode
        Http.BadBody msg ->
            "响应格式错误: " ++ msg


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }
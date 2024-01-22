module Main exposing (..)

import Browser
import Html exposing (Html, button, div, input, text, h1, li, ul)
import Html.Attributes exposing (placeholder, class)
import Html.Events exposing (onClick, onInput)
import Platform.Sub exposing (Sub)
import Http
import Random exposing (Generator, int, initialSeed, step, Seed)
import List exposing (head, drop)
import Maybe exposing (withDefault)

-- 模型
type alias Model =
    { word : String
    , wordList : List String
    , inputText : String
    , message : String
    , showAnswer : Bool
    , answer : String
    , randomNum : Int
    , selectedWord : String
    , content : String  
    }

init : Model
init =
    { word = ""
    , wordList = []
    , inputText = ""
    , message = ""
    , showAnswer = False
    , answer = ""
    , randomNum = 1
    , selectedWord = ""
    , content = ""
    } 

-- 消息类型
type Msg
    = SendHttpRequest
    |Submit
    | UpdateInput String
    | GotWords (Result Http.Error String)
    | ToggleAnswer
    | SelectRandomWord
    | NewRandomNumber Int

-- 更新函数
update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        SendHttpRequest->
            (model,getWordlist)

        Submit ->
            if model.inputText == model.selectedWord then
                ( { model | message = "你猜对了！" }, Cmd.none )
            else
                ( { model | message = "猜错了，请再试一次。" }, Cmd.none )

        ToggleAnswer ->
            if model.showAnswer == False then
                ({ model | answer = model.word }, Cmd.none )
            else
                ({ model | answer = "" }, Cmd.none )

        UpdateInput text ->
            ( { model | inputText = text }, Cmd.none )

        GotWords (Ok content) ->
            let
                wordList = String.words content
            in
            ( { model | wordList = wordList}, Random.generate NewRandomNumber (Random.int 0 999) )

        GotWords (Err error) ->
            ( { model | message = "错误：" ++ httpErrorToString error }, Cmd.none )

        NewRandomNumber num -> 
            let z = getRandomWord num model.wordList
            in case z of
                ""-> ({ model | randomNum = num }, Cmd.none)
                _-> ({ model | randomNum = num, selectedWord=z }, Cmd.none)
            

        SelectRandomWord ->
            let
                selectedWord =
                    getRandomWord model.randomNum model.wordList
            in
            ({ model | selectedWord = selectedWord }, Cmd.none)

-- 生成一个0到999之间的随机数
-- getRandomNumber : Int -> (Int, Seed)
-- getRandomNumber seed =
--     Random.step (Random.int 1 999) (initialSeed seed)

    

-- 获取随机数对应的单词
getRandomWord : Int -> List String -> String
getRandomWord randomNum wordList =
    case List.head (List.drop randomNum wordList) of
        Just y -> y
        Nothing -> ""

renderItem : String -> Html Msg
renderItem item =
    li [] [ text item ]


-- 视图函数
view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "根据提示猜单词" ]
        , div [] [ text ("提示：这个单词的意思是..." ++ model.content ++ model.selectedWord) ]
        , input [ placeholder "输入你的猜测", onInput UpdateInput ] []
        , button [ onClick Submit ] [ text "提交" ]
        , div [] [ text model.message ]
        , button [ onClick ToggleAnswer ] [ text "Show answer" ]
        , div []
            [ if model.showAnswer then
                div [] [ text model.word ]
              else
                text ""
            ]
        ,div []
            [ h1 [] [ text (String.fromInt model.randomNum) ]
            ]
        ,div []
            [ 
              button [ onClick SelectRandomWord ] [ text "选择单词" ]
            , div [] [ text ("随机数: " ++ String.fromInt model.randomNum) ]
            , div [] [ text ("选择的单词: " ++ model.selectedWord) ]
            ]
        , div []
            [ h1 [] [ text "单词列表" ]
            , ul [] (List.map renderItem model.wordList)
            ]
        ]

-- 订阅函数
subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


getWordlist : Cmd Msg
getWordlist =
    Http.get
        { url = "http://localhost:8000/thousand_words_things_explainer.txt"
        , expect = Http.expectString GotWords
        }


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

-- Elm 程序的主入口
main : Program () Model Msg
main =
    Browser.element
        { init = \_ -> (init, getWordlist)
        , update = update
        , view = view
        , subscriptions = subscriptions
        }
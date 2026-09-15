$ErrorActionPreference = 'Stop'
$Force = $false
$pagesRoot = Join-Path (Split-Path -Parent $PSScriptRoot) 'pages'
$translations = @{
  'PrayerbeforeRetiring.html' = @{
    'Prayer Before Retiring' = 'Prière avant de se coucher';
    'My God, another day has passed away. I come to you before going to rest to thank you for all the graces you have bestowed on me this day, graces to which I have so badly corresponded. I humbly ask pardon, Lord, for all the infidelities which I may have committed either by inadvertence, by dissipation of mind or by voluntary resistance to your grace. I would be very miserable, O my God, if you treat me as I deserve, but I hope in your mercy and kindness.' = 'Mon Dieu, un autre jour s’est écoulé. Je viens à vous avant de me reposer pour vous remercier de toutes les grâces que vous m’avez accordées aujourd’hui, grâces auxquelles j’ai si mal correspondu. Je vous demande humblement pardon, Seigneur, pour toutes les infidélités que j’ai pu commettre par inadvertance, distraction ou résistance volontaire à votre grâce. Je serais très malheureux, ô mon Dieu, si vous me traitiez selon mes mérites, mais j’espère en votre miséricorde et votre bonté.';
    'Bless, O my God, the rest I am going to take to restore my strength in order to serve you better. Holy Virgin, Mother of grace, Mother of mercy, refuge of sinners, extend your protecting hand over me during my sleep.' = 'Bénissez, ô mon Dieu, le repos que je vais prendre pour retrouver mes forces et mieux vous servir. Sainte Vierge, Mère de grâce, Mère de miséricorde, refuge des pécheurs, étendez votre main protectrice sur moi pendant mon sommeil.';
    'And you also my good Angel, assist me, help in order that no harm may come to me during this night and that the devil may not avail of this time to take me by surprise. My God, into your hand I commend my spirit.' = 'Et vous aussi, mon bon Ange, assistez-moi et aidez-moi afin qu’aucun mal ne m’atteigne cette nuit et que le démon ne profite pas de ce moment pour me surprendre. Mon Dieu, entre vos mains je remets mon esprit.'
  };
  'PrayerforAcceptanceofDeath.html' = @{
    'Prayer for Acceptance of Death' = 'Prière pour l’acceptation de la mort';
    'O Jesus, adoring your last breath, I beseech you to receive my own. I know not whether I shall have free use of my understanding when I leave this world. So from this moment I offer to you my agony and all the pains of my death. You are my Father and Savior. I commend my souls into your hands. I desire that my last moment be united to your dying breath and that the last beat of my heart be an act of pure love of you.' = 'Ô Jésus, adorant votre dernier souffle, je vous supplie de recevoir le mien. Je ne sais pas si je jouirai de toute ma raison lorsque je quitterai ce monde. Dès maintenant, je vous offre mon agonie et toutes les douleurs de ma mort. Vous êtes mon Père et mon Sauveur. Je remets mon âme entre vos mains. Je désire que mon dernier moment soit uni à votre dernier souffle et que le dernier battement de mon cœur soit un acte de pur amour pour vous.';
    'My Lord God, from this day I accept from your hands, with resignation and cheerfulness the kind of death it may please you to send me, with all its sorrows, pains and anguish. Amen' = 'Mon Seigneur et mon Dieu, dès aujourd’hui j’accepte de vos mains, avec résignation et joie, le genre de mort qu’il vous plaira de m’envoyer, avec toutes ses tristesses, douleurs et angoisses. Amen'
  };
  'PrayerforourSisters.html' = @{
    'Prayer for our Sisters' = 'Prière pour nos Sœurs';
    'Deign, O Lord, to bless all my Sisters. Have mercy on those who suffer; be Thyself their consolation. Have mercy on those who feel themselves forsaken; be Thyself their strength. Have mercy on those who are wavering; be Thyself their light. Have mercy on all those who feel weary; be Thyself their courage. Have mercy on all those who give themselves without counting the cost; be Thyself their wealth and their reward for their actions. And give to all of  us an increase of Charity more and more profound and more and more efficacious because this Charity is drawn from your Divine Heart. Amen.' = 'Daignez, Seigneur, bénir toutes mes Sœurs. Ayez pitié de celles qui souffrent ; soyez vous-même leur consolation. Ayez pitié de celles qui se sentent abandonnées ; soyez vous-même leur force. Ayez pitié de celles qui hésitent ; soyez vous-même leur lumière. Ayez pitié de toutes celles qui sont fatiguées ; soyez vous-même leur courage. Ayez pitié de toutes celles qui se donnent sans compter ; soyez vous-même leur richesse et la récompense de leurs actions. Accordez à toutes un accroissement de charité toujours plus profond et plus efficace, car cette charité est puisée dans votre Cœur divin. Amen.'
  };
  'PrayertoOurLadyofthisHouse.html' = @{
    'Prayer to Our Lady of this House' = 'Prière à Notre-Dame de cette maison';
    'O sweet and gentle Lady, Immaculate Mother of God, we choose you this day to be the mistress and lady of this house. Guard it, dear Mother, from pestilence, fire, lightning, tempests and earthquakes, from schisms and heresies, from depredation of burglars and the malice of enemies. Protect its inmates, sweet Mary. Watch over their going out and their coming in and preserve them from sudden death. Keep us from all sin and harm and pray for us to God, that we may live in His service and depart this life in His grace and pray for us to God, that we may live in His service and depart this life in His grace. Amen' = 'Ô douce et tendre Dame, Mère Immaculée de Dieu, nous vous choisissons aujourd’hui comme maîtresse et dame de cette maison. Gardez-la, chère Mère, de la peste, du feu, de la foudre, des tempêtes et des tremblements de terre, des schismes et des hérésies, des cambrioleurs et de la malice des ennemis. Protégez ses habitants, douce Marie. Veillez sur leurs sorties et leurs retours et préservez-les de la mort subite. Gardez-nous de tout péché et de tout mal et priez Dieu pour nous, afin que nous vivions à son service et quittions cette vie dans sa grâce. Amen.'
  };
  'PrayertoSt.Michael.html' = @{
    'Prayer to St. Michael' = 'Prière à saint Michel';
    'Saint Michael, the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil.' = 'Saint Michel Archange, défendez-nous dans le combat. Soyez notre protection contre la méchanceté et les embûches du démon.';
    'May God rebuke him, we humbly pray; and you, O Prince of the Heavenly hosts, by the power of God, thrust down into hell Satan and all the evil spirits who wander throughout the world, seeking the ruin of souls. Amen.' = 'Que Dieu le réprime, nous vous en supplions humblement ; et vous, Prince de la milice céleste, par la puissance de Dieu, précipitez en enfer Satan et tous les esprits mauvais qui parcourent le monde à la recherche de la perte des âmes. Amen.'
  };
  'afterconfession.html' = @{
    'Prayer After Confession' = 'Prière après la confession';
    'My dearest Jesus, I have told all my sins to the best of my ability. I have sincerely tried to make a good confession and I know that you have forgiven me. Thank you dear Jesus! Your divine heart is full of love and mercy for poor sinners. I love You dear Jesus; you are so good to me. My loving Saviour, I shall try to keep from sin and to love You more each day. Dearest Mother Mary, pray for me and help me to keep all my promises. Protect me and do not let me fall back into sin. Dear God, help me to lead a good life. Without Your grace I can do nothing. Amen!' = 'Mon très cher Jésus, je vous ai confessé tous mes péchés du mieux que j’ai pu. J’ai sincèrement essayé de faire une bonne confession et je sais que vous m’avez pardonné. Merci, cher Jésus ! Votre cœur divin est plein d’amour et de miséricorde pour les pauvres pécheurs. Je vous aime, cher Jésus ; vous êtes si bon pour moi. Mon Sauveur bien-aimé, je m’efforcerai d’éviter le péché et de vous aimer davantage chaque jour. Très chère Mère Marie, priez pour moi et aidez-moi à tenir toutes mes promesses. Protégez-moi et ne permettez pas que je retombe dans le péché. Mon Dieu, aidez-moi à mener une bonne vie. Sans votre grâce, je ne peux rien faire. Amen !'
  };
  'aftermeal.html' = @{
    'Prayer After Meals' = 'Prière après les repas';
    'We give Thee thanks for all Thy benefits, O Almighty God, who livest and reignest world without end. Amen. May the souls of the faithful departed, through the mercy of God, rest in peace. Amen.' = 'Nous vous rendons grâce pour tous vos bienfaits, ô Dieu tout-puissant, qui vivez et régnez pour les siècles des siècles. Amen. Que les âmes des fidèles défunts, par la miséricorde de Dieu, reposent en paix. Amen.'
  };
  'beforeconfession.html' = @{
    'Prayer Before Confession' = 'Prière avant la confession';
    'Come Holy Spirit into my soul, Enlighten my mind that I may know the sins I ought to confess, and grant me Your grace to confess them fully, humbly and with contrite heart. Help me to firmly resolve not to commit them again. O Blessed Virgin, Mother of my Redeemer, mirror of innocence and sanctity, and refuge of penitent sinners, intercede for me through the Passion of Your Son, that I may obtain the grace to make a good confession. All you blessed Angels and Saints of God, pray for me, a most miserable sinner, that I may repent from my evil ways, that my heart may henceforth be forever united with yours in eternal love. Amen.' = 'Venez, Esprit Saint, dans mon âme. Éclairez mon esprit afin que je connaisse les péchés que je dois confesser, et accordez-moi votre grâce pour les avouer pleinement, humblement et avec un cœur contrit. Aidez-moi à prendre la ferme résolution de ne plus les commettre. Ô Vierge bénie, Mère de mon Rédempteur, miroir d’innocence et de sainteté, refuge des pécheurs pénitents, intercédez pour moi par la Passion de votre Fils, afin que j’obtienne la grâce de faire une bonne confession. Vous tous, bienheureux Anges et Saints de Dieu, priez pour moi, pauvre pécheur, afin que je me repente de mes mauvaises voies et que mon cœur soit désormais uni pour toujours au vôtre dans l’amour éternel. Amen.'
  };
  'beforeholycommunion.html' = @{
    'Prayer Before Holy Communion' = 'Prière avant la sainte communion';
    'Come, O blessed Saviour, and nourish my soul with heavenly Food, the Food which contains every sweetness and every delight. Come, Bread of Angels, and satisfy the hunger of my soul. Come, glowing Furnace of Charity and enkindle in my heart the flame of divine love. Come, Light of the World, and enlighten the darkness of my mind. Come, King of Kings, and make me obedient to your holy will. Come, loving Saviour, and make me meek and humble. Come, Friend of the Sick, and heal the infirmities of my body and the weakness of my soul. Come, Good Shepherd, my God and my All, and take me to yourself. O most holy Mother, Mary Immaculate, prepare my heart to receive my Saviour.' = 'Venez, ô Sauveur béni, nourrir mon âme de la nourriture céleste, cette nourriture qui contient toute douceur et toute joie. Venez, Pain des Anges, et rassasiez la faim de mon âme. Venez, Fournaise ardente de charité, et allumez dans mon cœur la flamme de l’amour divin. Venez, Lumière du monde, et éclairez les ténèbres de mon esprit. Venez, Roi des rois, et rendez-moi obéissant à votre sainte volonté. Venez, Sauveur bien-aimé, et rendez-moi doux et humble. Venez, Ami des malades, et guérissez les infirmités de mon corps et la faiblesse de mon âme. Venez, Bon Pasteur, mon Dieu et mon Tout, et prenez-moi auprès de vous. Ô très sainte Mère, Marie Immaculée, préparez mon cœur à recevoir mon Sauveur.'
  };
  'beforemeal.html' = @{
    'Prayer Before Meals' = 'Prière avant les repas';
    'Bless us Oh Lord, and these thy gifts, which we are about to receive, from thy bounty, through Christ, Our Lord. Amen.' = 'Bénissez-nous, Seigneur, ainsi que ces dons que nous allons recevoir de votre bonté, par le Christ notre Seigneur. Amen.'
  };
  'contrition.html' = @{
    'Prayer for Contrition' = 'Prière de contrition';
    'Act of Contrition' = 'Acte de contrition';
    'My God, I am sorry' = 'Mon Dieu, je regrette';
    'for my sins with all my heart.' = 'mes péchés de tout mon cœur.';
    'In choosing to do wrong' = 'En choisissant de faire le mal';
    'and failing to do good,' = 'et en manquant de faire le bien,';
    'I have sinned against you' = 'j’ai péché contre vous';
    'whom I should love' = 'que je devrais aimer';
    'above all things.' = 'par-dessus toutes choses.';
    'I firmly intend,' = 'Je prends la ferme résolution,';
    'with your help,' = 'avec votre aide,';
    'to do prenance,' = 'de faire pénitence,';
    'to sin no more,' = 'de ne plus pécher,';
    'and to avoid' = 'et d’éviter';
    'whatever leads me to sin.' = 'tout ce qui conduit au péché.';
    'Our Savior Jesus Christ' = 'Notre Sauveur Jésus-Christ';
    'suffered and died for us.' = 'a souffert et est mort pour nous.';
    'In his name,' = 'En son nom,';
    'my God, have mercy. Amen' = 'mon Dieu, ayez pitié. Amen'
  };
  'DivinePraises.html' = @{
    'Divine Praises' = 'Louanges divines';
    'Blessed be God.' = 'Béni soit Dieu.';
    'Blessed be his Holy Name.' = 'Béni soit son saint nom.';
    'Blessed be Jesus Christ, true God and true man.' = 'Béni soit Jésus-Christ, vrai Dieu et vrai homme.';
    'Blessed be the name of Jesus.' = 'Béni soit le nom de Jésus.';
    'Blessed be His most Sacred Heart.' = 'Béni soit son très saint Cœur.';
    'Blessed be His most Precious Blood.' = 'Béni soit son très précieux Sang.';
    'Blessed be Jesus in the Most Holy Sacrament of the altar.' = 'Béni soit Jésus au très saint Sacrement de l’autel.';
    'Blessed be the Holy Spirit, the Paraclete.' = 'Béni soit l’Esprit Saint, le Paraclet.';
    'Blesses be the great Mother of God, Mary Most Holy.' = 'Bénie soit la grande Mère de Dieu, Marie très sainte.';
    'Blessed be her holy and Immaculate Conception.' = 'Bénie soit sa sainte et Immaculée Conception.';
    'Blessed be her glorious Assumption' = 'Bénie soit sa glorieuse Assomption';
    'Blessed be the name of Mary, Virgin and Mother' = 'Béni soit le nom de Marie, Vierge et Mère';
    'Blessed be St. Joseph, her most chaste spouse.' = 'Béni soit saint Joseph, son époux très chaste.';
    'Blessed be God in His Angels and in His Saints.' = 'Béni soit Dieu dans ses Anges et dans ses Saints.'
  };
  'Memorare.html' = @{
    'Memorare' = 'Souvenez-vous';
    'Remember, O most Loving Virgin Mary, that it is a thing un heard of that anyone who had recourse to your protection, Eia ergo, advocate nostra, illos tuos misericordes oculos ad nos converte. Implored your help or sought your intercession was ever left forsaken. Filled, therefore, with confidence in your goodness I fly to you, O Mother, Virgin of virgins. To you I come, before you I stand, a sorrowful sinner. Despise not my petitions, O Mother of the World Incarnate, but graciously hear and grant my prayer.' = 'Souvenez-vous, ô très aimable Vierge Marie, qu’on n’a jamais entendu dire qu’aucun de ceux qui ont eu recours à votre protection, imploré votre assistance ou demandé votre intercession ait été abandonné. Animé d’une pareille confiance, je cours vers vous, ô Vierge des vierges et ma Mère ; je viens à vous et, gémissant sous le poids de mes péchés, je me prosterne à vos pieds. Ô Mère du Verbe incarné, ne méprisez pas mes prières, mais écoutez-les favorablement et daignez les exaucer.'
  };
  'apostle.html' = @{
    'Apostle Creed' = 'Credo des Apôtres';
    'I believe in God,' = 'Je crois en Dieu,';
    'the Father Almighty,' = 'le Père tout-puissant,';
    'Creator of heaven and earth,' = 'créateur du ciel et de la terre,';
    'and in Jesus Christ, His only Son, our Lord,' = 'et en Jésus-Christ, son Fils unique, notre Seigneur,';
    'who was conceived by the Holy Spirit,' = 'qui a été conçu du Saint-Esprit,';
    'born of the Virgin Mary,' = 'est né de la Vierge Marie,';
    'suffered under Pontius Pilate,' = 'a souffert sous Ponce Pilate,';
    'was crucified, died and was buried;' = 'a été crucifié, est mort et a été enseveli ;';
    'He descended into hell;' = 'est descendu aux enfers ;';
    'on the third day He rose again from the dead;' = 'le troisième jour est ressuscité des morts ;';
    'He ascended into heaven,' = 'est monté aux cieux,';
    'and is seated at the right hand of God the Father Almighty;' = 'est assis à la droite de Dieu le Père tout-puissant ;';
    'from there He will come to judge the living and the dead.' = 'd’où il viendra juger les vivants et les morts.';
    'I believe in the Holy Spirit,' = 'Je crois en l’Esprit Saint,';
    'the Holy Catholic Church,' = 'à la sainte Église catholique,';
    'the communion of Saints,' = 'à la communion des saints,';
    'the forgiveness of sins,' = 'à la rémission des péchés,';
    'the resurrection of the body,' = 'à la résurrection de la chair,';
    'and life everlasting.' = 'à la vie éternelle.';
    'Amen.' = 'Amen.'
  };
  'hailmary.html' = @{
    'Hail Mary' = 'Je vous salue, Marie';
    'Hail Mary full of Grace, the Lord is with thee.' = 'Je vous salue, Marie, pleine de grâce ; le Seigneur est avec vous.';
    'Blessed are thou amongst women and blessed is the fruit of thy womb Jesus.' = 'Vous êtes bénie entre toutes les femmes, et Jésus, le fruit de vos entrailles, est béni.';
    'Holy Mary Mother of God,' = 'Sainte Marie, Mère de Dieu,';
    'pray for us sinners now and at the hour of our death' = 'priez pour nous, pauvres pécheurs, maintenant et à l’heure de notre mort.'
  };
  'guardian.html' = @{
    'Guardian Angel' = 'Ange gardien';
    'Angel of God,' = 'Ange de Dieu,';
    'my guardian dear,' = 'mon gardien bien-aimé,';
    "To whom God's love" = 'à qui l’amour de Dieu';
    'commits me here,' = 'me confie ici,';
    'Ever this day,' = 'reste à mes côtés ce jour,';
    'be at my side,' = 'pour me protéger,';
    'To light and guard,' = 'm’éclairer et me garder,';
    'Rule and guide.' = 'me conduire et me guider.';
    'Amen.' = 'Amen.'
  };
  'signofthecross.html' = @{
    'Sign of the Cross' = 'Signe de croix';
    'In the Name of the' = 'Au nom du';
    'Father, And the Son,' = 'Père, et du Fils,';
    'And the Holy Spirit.' = 'et du Saint-Esprit.';
    'Amen.' = 'Amen.'
  };
  'ActofConsecrationtotheImmaculateHeartofMary.html' = @{
    'Act of Consecration to the Immaculate Heart of Mary' = 'Acte de consécration au Cœur Immaculé de Marie';
    'My Queen, my Mother, I give myself entirely to you and to show my devotion to you, I consecrate to your Immaculate Heart this day, my life and my eternity, allt hat I am, all that I do, all those I love, my whole being without reserve. Wherefore, Good Mother, as I am your own, keep me, guard me as your property and possession. Amen.' = 'Ma Reine, ma Mère, je me donne entièrement à vous et, pour vous témoigner ma dévotion, je consacre aujourd’hui à votre Cœur Immaculé ma vie et mon éternité, tout ce que je suis, tout ce que je fais, tous ceux que j’aime, tout mon être sans réserve. Ainsi donc, bonne Mère, puisque je suis à vous, gardez-moi et protégez-moi comme votre bien et votre possession. Amen.';
    'V: O Mary, conceived without sin,' = 'V : Ô Marie, conçue sans péché,';
    'R: Pray for us who have recourse to you!' = 'R : Priez pour nous qui avons recours à vous !'
  };
  'ConsecrationtotheSacredHeartofJesus.html' = @{
    'Consecration to the Sacred Heart of Jesus' = 'Consécration au Sacré-Cœur de Jésus';
    'Most kind Jesus, redeemer of the human race, look down upon us, humbly prostrate before your altar. We belong to you since you bought us at the price of your blood, but to be more firmly united to you, each one of us freely consecrates herself to your Sacred Heart.' = 'Très doux Jésus, Rédempteur du genre humain, regardez-nous humblement prosternés devant votre autel. Nous vous appartenons, puisque vous nous avez rachetés au prix de votre sang ; mais pour être plus fermement unis à vous, chacun de nous se consacre librement à votre Sacré-Cœur.';
    'Many indeed have never known you. Many, too, despising your precepts, have rejected you. Have mercy on them all, most Merciful Jesus, and draw them to your Sacred Heart. Be King, O Lord, not only of the faithful who have never forsaken you, but also of the prodigal children who have abandoned you. Grant that may quickly return to their Fatherï¿½s house, last they die of wretchedness and hunger.' = 'Beaucoup ne vous ont jamais connu. Beaucoup aussi, méprisant vos commandements, vous ont rejeté. Ayez pitié de tous, Jésus très miséricordieux, et attirez-les à votre Sacré-Cœur. Soyez Roi, Seigneur, non seulement des fidèles qui ne vous ont jamais abandonné, mais aussi des enfants prodigues qui vous ont quitté. Faites qu’ils retournent rapidement à la maison de leur Père, de peur qu’ils ne meurent de misère et de faim.';
    'Be King of those who are deceived by erroneous opinions, or whom discord keep aloof, and call them back to the family of Godï¿½s children, so that there may be but one flock and one Shepherd. Grant, O Lord, to your Church unity of faith and freedom to proclaim your Gospel of Love, that justice and may triumph in all nations amd all peoples may form a great brotherhood. And make the earth resound from East to West with one cry: ï¿½Praise to the Divine Heart that gave us salvation. To Him, be glory and honor forever!ï¿½ Amen.' = 'Soyez le Roi de ceux que trompent les opinions erronées ou que la discorde tient éloignés, et ramenez-les à la famille des enfants de Dieu, afin qu’il n’y ait qu’un seul troupeau et un seul Pasteur. Accordez, Seigneur, à votre Église l’unité de la foi et la liberté de proclamer votre Évangile d’amour, afin que la justice triomphe dans toutes les nations et que tous les peuples forment une grande fraternité. Faites retentir la terre d’Orient en Occident d’un seul cri : « Louange au Cœur divin qui nous a donné le salut. À lui soient la gloire et l’honneur pour toujours ! » Amen.'
  };
  'ReginaCoeli.html' = @{
    'V: Queen of heaven, rejoice.  Alleluia' = 'V : Reine du ciel, réjouissez-vous. Alléluia';
    'R: The Son whom it was your privilege to bear. Alleluia' = 'R : Le Fils que vous avez mérité de porter. Alléluia';
    'V: As risen as He said. Alleluia' = 'V : Il est ressuscité comme il l’avait dit. Alléluia';
    'R: Pray God for us. Alleluia' = 'R : Priez Dieu pour nous. Alléluia';
    'V: Rejoice and be glad, Virgin Mary. Alleluia' = 'V : Réjouissez-vous et soyez dans l’allégresse, Vierge Marie. Alléluia';
    'R: For the Lord is truly risen. Alleluia' = 'R : Car le Seigneur est vraiment ressuscité. Alléluia';
    'Let us pray: O god, you were pleased to give joy to the world through the resurrection of your Son, our Lord Jesus Christ. Grant we beseech you that through the meditation of the Virgin Mary His Mother, we may come to possess the joys of life everlasting. Through the same Christ our Lord. Amen' = 'Prions : Ô Dieu, vous avez voulu donner la joie au monde par la résurrection de votre Fils, notre Seigneur Jésus-Christ. Accordez-nous, nous vous en supplions, que par la méditation de la Vierge Marie, sa Mère, nous parvenions aux joies de la vie éternelle. Par le même Christ notre Seigneur. Amen'
  };
  'thelordsprayer.html' = @{
    "The Lord's Prayer" = 'Notre Père';
    'Our Father, who art in heaven,' = 'Notre Père, qui es aux cieux,';
    'hallowed be thy Name,' = 'que ton nom soit sanctifié,';
    'thy kingdom come,' = 'que ton règne vienne,';
    'thy will be done,' = 'que ta volonté soit faite,';
    'on earth as it is in heaven.' = 'sur la terre comme au ciel.';
    'Give us this day our daily bread.' = 'Donne-nous aujourd’hui notre pain de ce jour.';
    'And forgive us our trespasses,' = 'Pardonne-nous nos offenses,';
    'as we forgive those who trespass against us.' = 'comme nous pardonnons aussi à ceux qui nous ont offensés.';
    'And lead us not into temptation,' = 'Et ne nous soumets pas à la tentation,';
    'but deliver us from evil.' = 'mais délivre-nous du Mal.'
  };
  'RenewalofVows.html' = @{
    'Renewal of Vows' = 'Renouvellement des vœux';
    'In the name of the Father and of the Son' = 'Au nom du Père et du Fils';
    'and of the Holy Spirit,' = 'et du Saint-Esprit,';
    'Lord Jesus, in Your presence,' = 'Seigneur Jésus, en votre présence,';
    'I renew the vows of' = 'je renouvelle les vœux de';
    'CHASTITY' = 'CHASTETÉ';
    'POVERTY' = 'PAUVRETÉ';
    'OBEDIENCE' = 'OBÉISSANCE';
    'Which I have made in the' = 'que j’ai prononcés dans la';
    'Congregation of the' = 'Congrégation des';
    'Sisters of St. Paul of Chartres.' = 'Sœurs de Saint-Paul de Chartres.';
    'Make me grow in Your love' = 'Faites-moi grandir dans votre amour';
    'And help me to remain faithful' = 'et aidez-moi à rester fidèle';
    'Until Your return. Amen.' = 'jusqu’à votre retour. Amen.'
  };
  'ActofFaith.html' = @{
    'Act of Faith' = 'Acte de foi';
    'My God, I firmly believe all the truths which you have revealed and which you teach us through your Church because you can neither deceive nor be deceived.' = 'Mon Dieu, je crois fermement à toutes les vérités que vous avez révélées et que vous nous enseignez par votre Église, parce que vous ne pouvez ni tromper ni être trompé.'
  };
  'ActofHope.html' = @{
    'Act of Hope' = 'Acte d’espérance';
    'My God, I hope with a firm confidence that through the merits of Jesus Christ you will give me your grace in this world and eternal happiness in the next because you have promised it and you are faithful to your promises.' = 'Mon Dieu, j’espère avec une ferme confiance que, par les mérites de Jésus-Christ, vous m’accorderez votre grâce en ce monde et le bonheur éternel dans l’autre, parce que vous l’avez promis et que vous êtes fidèle à vos promesses.'
  };
  'ActofCharity.html' = @{
    'Act of Charity' = 'Acte de charité';
    'My God, I love you with my whole heart and above all things because you are infinitely good, and I love my neighbor as myself for love of you.' = 'Mon Dieu, je vous aime de tout mon cœur et par-dessus toutes choses parce que vous êtes infiniment bon, et j’aime mon prochain comme moi-même pour l’amour de vous.'
  };
  'PrayerforPeace.html' = @{
    'Prayer for Peace' = 'Prière pour la paix';
    'God Our Father, You guide and govern everything with order and love. Accept the prayers we offer for our nation. Fill the hearts of all men with the spirit of love and the desire to ensure peace for all their brothers and sisters. By the wisdom of our leaders and the integrity of our citizens may we secure. Justice and equality, and end all division, and build a human society of love and peace.' = 'Dieu notre Père, vous guidez et gouvernez toute chose avec ordre et amour. Acceptez les prières que nous offrons pour notre nation. Remplissez les cœurs de tous les hommes de l’esprit d’amour et du désir d’assurer la paix à tous leurs frères et sœurs. Par la sagesse de nos dirigeants et l’intégrité de nos citoyens, que nous puissions établir la justice et l’égalité, mettre fin à toute division et construire une société humaine d’amour et de paix.';
    'Through the Intercession of Mary, Our Lady of the Immaculate Conception, under whose maternal protection we have placed our land, free it from the threats of evil and violence. May it citizens remain ever faithful to Your son and the Holy Spirit, One God, forever and ever. Amen.' = 'Par l’intercession de Marie, Notre-Dame de l’Immaculée Conception, sous la protection maternelle de laquelle nous avons placé notre pays, délivrez-le des menaces du mal et de la violence. Que ses citoyens restent toujours fidèles à votre Fils et au Saint-Esprit, Dieu unique, pour les siècles des siècles. Amen.'
  };
  'PrayeruponRising.html' = @{
    'Prayer upon Rising' = 'Prière au lever';
    'My God, I give you my heart. Please take it in order that no creature may take or possess it except oyu alone. My good Angel, I recommend myself to you. You watched over me last night. Keep me today from danger, from offending God. May the grace of the Holy Spirit direct all my actions. May it be a continual help and assistance to me.' = 'Mon Dieu, je vous donne mon cœur. Prenez-le afin qu’aucune créature ne puisse le prendre ou le posséder, sinon vous seul. Mon bon Ange, je me recommande à vous. Vous avez veillé sur moi cette nuit. Gardez-moi aujourd’hui du danger et de l’offense envers Dieu. Que la grâce de l’Esprit Saint dirige toutes mes actions et soit pour moi une aide et un soutien continus.';
    'My God, I disown all evil, vain, proud thoughts, all those contrary to charity which may come to me this day. I desire to remember often Your holy presence and to perform my actions for you alone. Divine heart of Jesus, let me love you ever more and more.' = 'Mon Dieu, je rejette toute pensée mauvaise, vaine ou orgueilleuse, et toute pensée contraire à la charité qui pourrait me venir aujourd’hui. Je désire me souvenir souvent de votre sainte présence et accomplir mes actions pour vous seul. Cœur divin de Jésus, faites que je vous aime toujours davantage.';
    'My God, I desire to live this day for your glory and the salvation of the world.' = 'Mon Dieu, je désire vivre cette journée pour votre gloire et le salut du monde.'
  };
  'morning.html' = @{
    'Morning Prayer' = 'Prière du matin';
    'God our Father, I come before you this morning, I thank you for the gift of my life, the life of my family members and that of my friends.' = 'Dieu notre Père, je viens devant vous ce matin et je vous remercie pour le don de ma vie, de celle des membres de ma famille et de mes amis.';
    'Thank you, Lord, for directing, protecting, guiding, guarding, governing and taking care of me throughout the night. I have woken up because of your abundant Mercies and Grace.' = 'Merci, Seigneur, de m’avoir dirigé, protégé, guidé, gardé et soutenu pendant toute la nuit. Je me suis réveillé grâce à vos abondantes miséricordes et à votre grâce.';
    'Merciful God, this morning, I submit myself into your mighty hands, may you fill me with your wisdom and grant me good health as I undertake my every deed today.' = 'Dieu miséricordieux, ce matin je me remets entre vos mains puissantes. Remplissez-moi de votre sagesse et accordez-moi une bonne santé dans chacune de mes actions aujourd’hui.';
    'Lord, Bless the work of my hands so that all that I do today may be fulfilling to me, helpful to humanity and may I do it according to your Holy Will and for the greater glory of your name.' = 'Seigneur, bénissez le travail de mes mains afin que tout ce que je ferai aujourd’hui m’accomplisse, soit utile à l’humanité et se réalise selon votre sainte volonté, pour la plus grande gloire de votre nom.';
    'Angel of the Lord, appointed by the Divine Mercy to be my guardian, enlighten, protect, direct and govern me this day. Amen.' = 'Ange du Seigneur, établi par la divine miséricorde pour être mon gardien, éclairez-moi, protégez-moi, dirigez-moi et gardez-moi aujourd’hui. Amen.'
  };
  'night.html' = @{
    'Night Prayer' = 'Prière du soir';
    'Eternal Father,' = 'Père éternel,';
    'I desire to rest in Thy Heart this night.' = 'Je désire reposer cette nuit dans votre Cœur.';
    'I make the intention of offering to Thee' = 'J’ai l’intention de vous offrir';
    'every beat of my heart,' = 'chaque battement de mon cœur,';
    'joining to them as many acts of love and desire.' = 'en y joignant autant d’actes d’amour et de désir.';
    'I pray that even while I am asleep,' = 'Je vous prie de faire que, même pendant mon sommeil,';
    'I will bring back to Thee souls that offend Thee.' = 'je vous ramène les âmes qui vous offensent.';
    'I ask forgiveness for the whole world,' = 'Je demande pardon pour le monde entier,';
    'especially for those who know Thee and yet sin.' = 'surtout pour ceux qui vous connaissent et qui pèchent pourtant.';
    'I offer to Thee my every breath and heartbeat' = 'Je vous offre chacun de mes souffles et battements de cœur';
    'as a prayer of reparation.' = 'comme une prière de réparation.';
    'Amen.' = 'Amen.'
  };
  'ActofContrition.html' = @{
    'Act of Contrition' = 'Acte de contrition';
    'My God, I am very sorry for having offended you because you are infinitely good and sin displeases you. I firmly resolve with the help of your grace not to offend you again and to do penance.' = 'Mon Dieu, je regrette vivement de vous avoir offensé, parce que vous êtes infiniment bon et que le péché vous déplaît. Je prends la ferme résolution, avec l’aide de votre grâce, de ne plus vous offenser et de faire pénitence.'
  };
  'PrayertotheHolySpirit.html' = @{
    'Prayer to the Holy Spirit' = 'Prière à l’Esprit Saint';
    'Come, Holy Spirit, fill the hearts of your faithful and kindle in them the fires of your love.' = 'Venez, Esprit Saint, remplissez les cœurs de vos fidèles et allumez en eux le feu de votre amour.';
    'V: Send forth your Spirit and they shall be created' = 'V : Envoyez votre Esprit et ils seront créés';
    'R: And you shall renew the face of the earth.' = 'R : Et vous renouvellerez la face de la terre.';
    'Let us pray:  O God who by the light of the Holy Spirit did instruct the hearts of your faithful, grant that by the same Holy Spirit we may be truly wise and ever rejoice in his consolation. Through Christ our Lord. Amen.' = 'Prions : Ô Dieu, qui avez instruit les cœurs de vos fidèles par la lumière de l’Esprit Saint, faites que ce même Esprit nous rende vraiment sages et nous donne de goûter toujours sa consolation. Par le Christ notre Seigneur. Amen.'
  }
}
foreach ($entry in $translations.GetEnumerator()) {
  $source = Join-Path $pagesRoot $entry.Key
  $target = Join-Path $pagesRoot ($entry.Key -replace '\.html$', '.fr.html')
  if ((Test-Path $target) -and -not $Force) {
    Write-Output "Skipped existing reviewed file $target"
    continue
  }
  $html = Get-Content $source -Raw
  foreach ($pair in $entry.Value.GetEnumerator()) { $html = $html.Replace($pair.Key, $pair.Value) }
  Set-Content $target $html -Encoding UTF8
  Write-Output "Created $target"
}
